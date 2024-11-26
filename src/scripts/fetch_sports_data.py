from nba_api.stats.static import players as nba_players, teams as nba_teams
import requests
import json
import os
import time

# NFL team mappings
NFL_TEAMS = {
    'ARI': 22, 'ATL': 1, 'BAL': 33, 'BUF': 2, 'CAR': 29, 'CHI': 3, 
    'CIN': 4, 'CLE': 5, 'DAL': 6, 'DEN': 7, 'DET': 8, 'GB': 9, 
    'HOU': 34, 'IND': 11, 'JAX': 30, 'KC': 12, 'LAC': 24, 'LAR': 14, 
    'LV': 13, 'MIA': 15, 'MIN': 16, 'NE': 17, 'NO': 18, 'NYG': 19, 
    'NYJ': 20, 'PHI': 21, 'PIT': 23, 'SEA': 26, 'SF': 25, 'TB': 27, 
    'TEN': 10, 'WSH': 28
}

# NHL team abbreviations
NHL_TEAMS = [
    'ANA', 'ARI', 'BOS', 'BUF', 'CGY', 'CAR', 'CHI', 'COL', 'CBJ', 'DAL',
    'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NSH', 'NJD', 'NYI', 'NYR',
    'OTT', 'PHI', 'PIT', 'SJS', 'SEA', 'STL', 'TBL', 'TOR', 'VAN', 'VGK',
    'WSH', 'WPG'
]

def get_nba_data():
    """Fetch NBA data using nba_api"""
    print("Fetching NBA data...")
    all_players = nba_players.get_active_players()
    all_teams = nba_teams.get_teams()

    formatted_players = [{
        "id": player["id"],
        "full_name": player["full_name"],
        "first_name": player["first_name"],
        "last_name": player["last_name"],
        "is_active": player["is_active"],
        "type": "player",
        "league": "NBA"
    } for player in all_players]

    formatted_teams = [{
        "id": team["id"],
        "full_name": team["full_name"],
        "abbreviation": team["abbreviation"],
        "nickname": team["nickname"],
        "city": team["city"],
        "state": team["state"],
        "year_founded": team["year_founded"],
        "type": "team",
        "league": "NBA"
    } for team in all_teams]

    return {"players": formatted_players, "teams": formatted_teams}

def get_mlb_data():
    """Fetch MLB data using MLB Stats API"""
    print("Fetching MLB data...")
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # MLB Teams
        teams_response = requests.get(
            "https://statsapi.mlb.com/api/v1/teams?sportId=1",
            headers=headers
        )
        teams_data = teams_response.json()
        
        formatted_teams = [{
            "id": team["id"],
            "full_name": team["name"],
            "abbreviation": team.get("abbreviation", ""),
            "type": "team",
            "league": "MLB",
            "venue": team.get("venue", {}).get("name", ""),
            "division": team.get("division", {}).get("name", "")
        } for team in teams_data.get("teams", [])]

        # MLB Players (40-man roster for each team)
        formatted_players = []
        for team in teams_data.get("teams", []):
            try:
                roster_response = requests.get(
                    f"https://statsapi.mlb.com/api/v1/teams/{team['id']}/roster/40man",
                    headers=headers
                )
                roster_data = roster_response.json()
                
                for player in roster_data.get("roster", []):
                    person = player.get("person", {})
                    formatted_players.append({
                        "id": person.get("id"),
                        "full_name": person.get("fullName"),
                        "type": "player",
                        "league": "MLB",
                        "team_id": team["id"],
                        "position": player.get("position", {}).get("abbreviation", "")
                    })
                time.sleep(0.5)  # Add delay to avoid rate limiting
            except Exception as e:
                print(f"Error fetching roster for MLB team {team['id']}: {e}")

        return {"players": formatted_players, "teams": formatted_teams}
    except Exception as e:
        print(f"Error fetching MLB data: {e}")
        return {"players": [], "teams": []}

def get_nhl_data():
    """Fetch NHL data using NHL API"""
    print("Fetching NHL data...")
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        formatted_teams = []
        formatted_players = []

        # First, get team info
        teams_response = requests.get(
            "https://api-web.nhle.com/v1/standings/now",
            headers=headers
        )
        teams_data = teams_response.json()
        
        # Extract team info from standings
        for team in teams_data.get('standings', []):
            formatted_teams.append({
                "id": team.get('teamAbbrev', {}).get('default'),
                "full_name": team.get('teamName', {}).get('default'),
                "abbreviation": team.get('teamAbbrev', {}).get('default'),
                "type": "team",
                "league": "NHL"
            })

        # Then fetch roster for each team
        for team in formatted_teams:
            try:
                roster_response = requests.get(
                    f"https://api-web.nhle.com/v1/roster/{team['abbreviation']}/current",
                    headers=headers
                )
                
                if roster_response.status_code == 200:
                    roster_data = roster_response.json()
                    
                    # Process forwards, defensemen, and goalies
                    for category in ['forwards', 'defensemen', 'goalies']:
                        for player in roster_data.get(category, []):
                            formatted_players.append({
                                "id": player.get('id'),
                                "full_name": f"{player.get('firstName', {}).get('default', '')} {player.get('lastName', {}).get('default', '')}".strip(),
                                "type": "player",
                                "league": "NHL",
                                "team_id": team['id'],
                                "position": player.get('positionCode', '')
                            })
                
                time.sleep(0.5)  # Add delay to avoid rate limiting
            except Exception as e:
                print(f"Error fetching roster for NHL team {team['abbreviation']}: {e}")

        return {"players": formatted_players, "teams": formatted_teams}
    except Exception as e:
        print(f"Error fetching NHL data: {e}")
        return {"players": [], "teams": []}

def get_nfl_data():
    """Fetch NFL data using ESPN API"""
    print("Fetching NFL data...")
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        formatted_teams = []
        formatted_players = []

        # First get all teams data
        teams_response = requests.get(
            "http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams",
            headers=headers
        )
        teams_data = teams_response.json()

        # Process teams from the correct path in the response
        teams_list = teams_data.get('sports', [{}])[0].get('leagues', [{}])[0].get('teams', [])
        
        # Create team mapping for later use
        team_mapping = {}
        
        for team_entry in teams_list:
            team = team_entry.get('team', {})
            team_id = str(team.get('id', ''))
            team_abbrev = next((abbrev for abbrev, id in NFL_TEAMS.items() 
                              if str(id) == team_id), None)
            
            if team_abbrev:
                formatted_teams.append({
                    "id": team_id,
                    "full_name": team.get('displayName', ''),
                    "abbreviation": team_abbrev,
                    "type": "team",
                    "league": "NFL",
                    "location": team.get('location', '')
                })
                team_mapping[team_id] = team_abbrev

        # Fetch all active NFL players
        try:
            players_url = "https://sports.core.api.espn.com/v3/sports/football/nfl/athletes?limit=20000&active=true"
            players_response = requests.get(players_url, headers=headers)
            
            if players_response.status_code == 200:
                players_data = players_response.json()
                
                # Process players
                for player in players_data.get('items', []):
                    if player.get('active', False):  # Only include active players
                        formatted_players.append({
                            "id": player.get('id', ''),
                            "full_name": player.get('displayName', ''),
                            "type": "player",
                            "league": "NFL",
                            "team_id": player.get('team', {}).get('id', ''),
                            "position": player.get('position', {}).get('abbreviation', '')
                        })
            else:
                print(f"Failed to fetch NFL players. Status code: {players_response.status_code}")
                
        except Exception as e:
            print(f"Error fetching NFL players: {e}")

        return {"players": formatted_players, "teams": formatted_teams}
    except Exception as e:
        print(f"Error fetching NFL data: {e}")
        return {"players": [], "teams": []}

def fetch_all_sports_data():
    """Fetch and combine data from all sports"""
    sports_data = {
        "NBA": get_nba_data(),
        "MLB": get_mlb_data(),
        "NHL": get_nhl_data(),
        "NFL": get_nfl_data()
    }

    # Create data directory if it doesn't exist
    os.makedirs('src/data', exist_ok=True)

    # Save to JSON file
    with open('src/data/sports_data.json', 'w') as f:
        json.dump(sports_data, f, indent=2)

    # Print summary
    for league, data in sports_data.items():
        print(f"\n{league} Summary:")
        print(f"Teams: {len(data['teams'])}")
        print(f"Players: {len(data['players'])}")

    print("\nSports data successfully saved to src/data/sports_data.json")

if __name__ == "__main__":
    fetch_all_sports_data()
