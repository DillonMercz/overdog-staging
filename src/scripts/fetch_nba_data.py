from nba_api.stats.static import players, teams
import json
import os

# Fetch all active players
all_players = players.get_active_players()

# Fetch all teams
all_teams = teams.get_teams()

# Format players data
formatted_players = [{
    'id': player['id'],
    'full_name': player['full_name'],
    'first_name': player['first_name'],
    'last_name': player['last_name'],
    'is_active': player['is_active'],
    'type': 'player'
} for player in all_players]

# Format teams data
formatted_teams = [{
    'id': team['id'],
    'full_name': team['full_name'],
    'abbreviation': team['abbreviation'],
    'nickname': team['nickname'],
    'city': team['city'],
    'state': team['state'],
    'year_founded': team['year_founded'],
    'type': 'team'
} for team in all_teams]

# Combine data
nba_data = {
    'players': formatted_players,
    'teams': formatted_teams
}

# Save to JSON file
output_path = 'src/data/nba_data.json'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w') as f:
    json.dump(nba_data, f, indent=2)

print(f"NBA data successfully saved to {output_path}")
