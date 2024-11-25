from datetime import datetime
from nba_api.stats.static import players
from nba_api.stats.endpoints import PlayerGameLog
import time
import requests
from fastapi import FastAPI, Query, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Union, Optional, Any
from pydantic import BaseModel, Field
import jwt
from functools import lru_cache

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LineCheckRequest(BaseModel):
    player_name: str
    season: str
    stat_type: str
    stat_value: float
    over_under: str

class PlayerStatsResponse(BaseModel):
    stats: List[Dict[str, Any]]  # Changed to Any to accept any type including None
    seasons: List[str]
    player_id: int
    error: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True

async def verify_token(authorization: str = Header(...)) -> str:
    try:
        if not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        token = authorization.split(' ')[1]
        # In production, you would verify the token with Supabase
        # For now, we'll just check if it exists
        if not token:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@lru_cache(maxsize=1000)
def get_player_id(first_name: str, last_name: str) -> Optional[int]:
    player_dict = players.get_active_players()
    for player in player_dict:
        if player['first_name'].lower() == first_name.lower() and player['last_name'].lower() == last_name.lower():
            return player['id']
    return None

def get_player_stats(player_id: int, season: str, retries: int = 3, timeout: int = 60):
    for attempt in range(retries):
        try:
            print(f"Attempting to fetch stats for player {player_id} for season {season} (Attempt {attempt + 1}/{retries})")
            game_log = PlayerGameLog(
                player_id=player_id,
                season=season,
                season_type_all_star="Regular Season",
                timeout=timeout
            )
            stats_df = game_log.get_data_frames()[0]
            
            if stats_df.empty:
                print(f"No data returned for player {player_id} in season {season}")
                raise HTTPException(
                    status_code=404,
                    detail=f"No stats found for this player in the {season} season"
                )
            
            # Add Double Double (DD) and Triple Double (TD) columns
            stats_df['DD'] = stats_df.apply(lambda row: 'YES' if count_double_double(row) >= 2 else 'NO', axis=1)
            stats_df['TD'] = stats_df.apply(lambda row: 'YES' if count_double_double(row) >= 3 else 'NO', axis=1)
            
            # Add PLAYER_ID column
            stats_df['PLAYER_ID'] = player_id
            
            # Convert DataFrame to dict and handle None values
            stats_dict = stats_df.replace({float('nan'): None}).to_dict(orient='records')
            
            print(f"Successfully fetched {len(stats_df)} games for player {player_id} in season {season}")
            return stats_dict
        except requests.exceptions.ReadTimeout:
            print(f"Timeout occurred, retrying... ({attempt + 1}/{retries})")
            time.sleep(2)
        except Exception as e:
            print(f"Error fetching stats: {str(e)}")
            if attempt == retries - 1:  # Last attempt
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to fetch player stats: {str(e)}"
                )
            time.sleep(2)
    raise HTTPException(status_code=504, detail="Failed to fetch data after multiple retries")

def count_double_double(row) -> int:
    stats = [row['PTS'], row['REB'], row['AST'], row['STL'], row['BLK']]
    return sum(1 for stat in stats if stat >= 10)

def calculate_averages(stats_list):
    if not stats_list:
        return {}
    
    total_games = len(stats_list)
    sums = {
        'PTS': 0, 'AST': 0, 'REB': 0, 'STL': 0,
        'BLK': 0, 'TOV': 0, 'FG3M': 0, 'PF': 0
    }
    
    for game in stats_list:
        for stat in sums:
            if game.get(stat) is not None:
                sums[stat] += game[stat]
    
    return {
        'avg_pts': round(sums['PTS'] / total_games, 2),
        'avg_ast': round(sums['AST'] / total_games, 2),
        'avg_reb': round(sums['REB'] / total_games, 2),
        'avg_stl': round(sums['STL'] / total_games, 2),
        'avg_blk': round(sums['BLK'] / total_games, 2),
        'avg_tov': round(sums['TOV'] / total_games, 2),
        'avg_3pts': round(sums['FG3M'] / total_games, 2),
        'avg_pf': round(sums['PF'] / total_games, 2)
    }

def generate_seasons() -> List[str]:
    current_year = datetime.now().year
    current_season_start = current_year if datetime.now().month >= 10 else current_year - 1
    return [f"{year}-{str(year + 1)[-2:]}" for year in range(current_season_start - 4, current_season_start + 1)]

@app.get("/api/player-suggestions")
async def get_player_suggestions(
    query: str = Query(...),
    token: str = Depends(verify_token)
) -> List[str]:
    if not query or len(query.strip()) < 2:
        return []

    query = query.lower().strip()
    active_players = players.get_active_players()
    suggestions = []
    
    for player in active_players:
        full_name = f"{player['first_name']} {player['last_name']}".lower()
        first_name = player['first_name'].lower()
        last_name = player['last_name'].lower()
        
        if (query in full_name or 
            query in first_name or 
            query in last_name or 
            first_name.startswith(query) or 
            last_name.startswith(query)):
            suggestions.append(f"{player['first_name']} {player['last_name']}")

    return sorted(list(set(suggestions)))[:10]

@app.get("/api/player-stats", response_model=PlayerStatsResponse)
async def get_stats(
    player: str = Query(...),
    season: str = Query(...),
    token: str = Depends(verify_token)
) -> PlayerStatsResponse:
    try:
        print(f"Received request for player: {player}, season: {season}")
        first_name, last_name = player.split(' ', 1)
    except ValueError:
        raise HTTPException(status_code=400, detail="Please provide both first and last name")

    player_id = get_player_id(first_name, last_name)
    if not player_id:
        raise HTTPException(status_code=404, detail=f"Player {player} not found")

    print(f"Found player ID: {player_id}")

    try:
        stats_list = get_player_stats(player_id, season)
        seasons = generate_seasons()

        return PlayerStatsResponse(
            stats=stats_list,
            seasons=seasons,
            player_id=player_id
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error processing stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/check-line")
async def check_line(
    request: LineCheckRequest,
    token: str = Depends(verify_token)
) -> Dict[str, Union[str, bool]]:
    try:
        first_name, last_name = request.player_name.split(' ', 1)
    except ValueError:
        raise HTTPException(status_code=400, detail="Please provide both first and last name")

    player_id = get_player_id(first_name, last_name)
    if not player_id:
        raise HTTPException(status_code=404, detail=f"Player {request.player_name} not found")

    try:
        stats_list = get_player_stats(player_id, request.season)

        # Handle combined stats
        if request.stat_type == 'PTS_AST':
            for game in stats_list:
                game['COMBINED'] = (game.get('PTS', 0) or 0) + (game.get('AST', 0) or 0)
            stat_column = 'COMBINED'
        elif request.stat_type == 'PTS_REB':
            for game in stats_list:
                game['COMBINED'] = (game.get('PTS', 0) or 0) + (game.get('REB', 0) or 0)
            stat_column = 'COMBINED'
        elif request.stat_type == 'PTS_AST_REB':
            for game in stats_list:
                game['COMBINED'] = (game.get('PTS', 0) or 0) + (game.get('AST', 0) or 0) + (game.get('REB', 0) or 0)
            stat_column = 'COMBINED'
        else:
            stat_column = request.stat_type

        # Count line hits
        line_hits = 0
        for game in stats_list:
            if request.stat_type in ['DD', 'TD']:
                if request.over_under == 'over':
                    line_hits += 1 if game.get(request.stat_type) == 'YES' else 0
                else:
                    line_hits += 1 if game.get(request.stat_type) == 'NO' else 0
            else:
                stat_value = game.get(stat_column, 0) or 0
                if request.over_under == 'over':
                    line_hits += 1 if stat_value > request.stat_value else 0
                else:
                    line_hits += 1 if stat_value < request.stat_value else 0

        total_games = len(stats_list)
        hit_percentage = (line_hits / total_games) * 100 if total_games > 0 else 0

        stat_display = {
            'PTS_AST': 'Points + Assists',
            'PTS_REB': 'Points + Rebounds',
            'PTS_AST_REB': 'Points + Assists + Rebounds'
        }.get(request.stat_type, request.stat_type)

        message = f"Line {request.over_under} {request.stat_value} {stat_display} hit {line_hits}/{total_games} times ({hit_percentage:.1f}%)"
        return {"message": message, "success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8888)
