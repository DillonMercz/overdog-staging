export interface TeamAbbreviations {
  [key: string]: string;
}

export const NHL_TEAM_ABBREVIATIONS: TeamAbbreviations = {
  "Anaheim Ducks": "ANA",
  "Arizona Coyotes": "ARI", 
  "Boston Bruins": "BOS",
  "Buffalo Sabres": "BUF",
  "Calgary Flames": "CGY",
  "Carolina Hurricanes": "CAR",
  "Chicago Blackhawks": "CHI",
  "Colorado Avalanche": "COL",
  "Columbus Blue Jackets": "CBJ",
  "Dallas Stars": "DAL",
  "Detroit Red Wings": "DET",
  "Edmonton Oilers": "EDM",
  "Florida Panthers": "FLA",
  "Los Angeles Kings": "LAK",
  "Minnesota Wild": "MIN",
  "Montreal Canadiens": "MTL",
  "Nashville Predators": "NSH",
  "New Jersey Devils": "NJD",
  "New York Islanders": "NYI",
  "New York Rangers": "NYR",
  "Ottawa Senators": "OTT",
  "Philadelphia Flyers": "PHI",
  "Pittsburgh Penguins": "PIT",
  "San Jose Sharks": "SJS",
  "Seattle Kraken": "SEA",
  "St. Louis Blues": "STL",
  "Tampa Bay Lightning": "TBL",
  "Toronto Maple Leafs": "TOR",
  "Vancouver Canucks": "VAN",
  "Vegas Golden Knights": "VGK",
  "Washington Capitals": "WSH",
  "Winnipeg Jets": "WPG"
} as const;

export interface NHLPlayer {
  PlayerID: string;
  /** NHL API team ID */
  TeamID: string;
  /** Three-letter team abbreviation (e.g., 'VGK' for Vegas Golden Knights) */
  TeamAbbreviation: string;
}

/**
 * Interface representing the full NHL players object
 * Key is the player's full name, value is their data
 */
export interface NHLPlayers {
  [playerName: string]: NHLPlayer;
}

/**
 * Object containing all NHL player data
 * Format:
 * {
 *   "Player Name": {
 *     "PlayerID": "12345678",
 *     "TeamID": "12",
 *     "TeamAbbreviation": "ABC"
 *   }
 * }
 */
export const NHL_PLAYERS: NHLPlayers = {
  "Ivan Barbashev": {
    "PlayerID": "8477964",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Brendan Brisson": {
    "PlayerID": "8482153",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Pavel Dorofeyev": {
    "PlayerID": "8481604",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Jack Eichel": {
    "PlayerID": "8478403",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Tomas Hertl": {
    "PlayerID": "8476881",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Alexander Holtz": {
    "PlayerID": "8482125",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Brett Howden": {
    "PlayerID": "8479353",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Keegan Kolesar": {
    "PlayerID": "8478434",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Victor Olofsson": {
    "PlayerID": "8478109",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Tanner Pearson": {
    "PlayerID": "8476871",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Nicolas Roy": {
    "PlayerID": "8478462",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Cole Schwindt": {
    "PlayerID": "8481655",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Mark Stone": {
    "PlayerID": "8475913",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Nicolas Hague": {
    "PlayerID": "8479980",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Noah Hanifin": {
    "PlayerID": "8478396",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Ben Hutton": {
    "PlayerID": "8477018",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Kaedan Korczak": {
    "PlayerID": "8481527",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Brayden McNabb": {
    "PlayerID": "8475188",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Alex Pietrangelo": {
    "PlayerID": "8474565",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Shea Theodore": {
    "PlayerID": "8477447",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Zach Whitecloud": {
    "PlayerID": "8480727",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Adin Hill": {
    "PlayerID": "8478499",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Ilya Samsonov": {
    "PlayerID": "8478492",
    "TeamID": "54",
    "TeamAbbreviation": "VGK"
  },
  "Jamie Benn": {
    "PlayerID": "8473994",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Colin Blackwell": {
    "PlayerID": "8476278",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Mavrik Bourque": {
    "PlayerID": "8482145",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Oskar Bäck": {
    "PlayerID": "8480840",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Evgenii Dadonov": {
    "PlayerID": "8474149",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Matt Duchene": {
    "PlayerID": "8475168",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Roope Hintz": {
    "PlayerID": "8478449",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Wyatt Johnston": {
    "PlayerID": "8482740",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Mason Marchment": {
    "PlayerID": "8478975",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Jason Robertson": {
    "PlayerID": "8480027",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Tyler Seguin": {
    "PlayerID": "8475794",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Logan Stankoven": {
    "PlayerID": "8482702",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Sam Steel": {
    "PlayerID": "8479351",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Mathew Dumba": {
    "PlayerID": "8476856",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Thomas Harley": {
    "PlayerID": "8481581",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Miro Heiskanen": {
    "PlayerID": "8480036",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Esa Lindell": {
    "PlayerID": "8476902",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Nils Lundkvist": {
    "PlayerID": "8480878",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Ilya Lyubushkin": {
    "PlayerID": "8480950",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Brendan Smith": {
    "PlayerID": "8474090",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Casey DeSmith": {
    "PlayerID": "8479193",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Jake Oettinger": {
    "PlayerID": "8479979",
    "TeamID": "25",
    "TeamAbbreviation": "DAL"
  },
  "Mikael Backlund": {
    "PlayerID": "8474150",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Blake Coleman": {
    "PlayerID": "8476399",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Matt Coronato": {
    "PlayerID": "8482679",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Samuel Honzek": {
    "PlayerID": "8484180",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Jonathan Huberdeau": {
    "PlayerID": "8476456",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Nazem Kadri": {
    "PlayerID": "8475172",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Justin Kirkland": {
    "PlayerID": "8477993",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Adam Klapka": {
    "PlayerID": "8483609",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Andrei Kuzmenko": {
    "PlayerID": "8483808",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Ryan Lomberg": {
    "PlayerID": "8479066",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Anthony Mantha": {
    "PlayerID": "8477511",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Martin Pospisil": {
    "PlayerID": "8481028",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Kevin Rooney": {
    "PlayerID": "8479291",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Yegor Sharangovich": {
    "PlayerID": "8481068",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Connor Zary": {
    "PlayerID": "8482074",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Rasmus Andersson": {
    "PlayerID": "8478397",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Kevin Bahl": {
    "PlayerID": "8480860",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Tyson Barrie": {
    "PlayerID": "8475197",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Jake Bean": {
    "PlayerID": "8479402",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Joel Hanley": {
    "PlayerID": "8477810",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Daniil Miromanov": {
    "PlayerID": "8482624",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Brayden Pachal": {
    "PlayerID": "8481167",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "MacKenzie Weegar": {
    "PlayerID": "8477346",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Dan Vladar": {
    "PlayerID": "8478435",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Dustin Wolf": {
    "PlayerID": "8481692",
    "TeamID": "20",
    "TeamAbbreviation": "CGY"
  },
  "Jaret Anderson-Dolan": {
    "PlayerID": "8479994",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Mason Appleton": {
    "PlayerID": "8478891",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Morgan Barron": {
    "PlayerID": "8480289",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Kyle Connor": {
    "PlayerID": "8478398",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Nikolaj Ehlers": {
    "PlayerID": "8477940",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "David Gustafsson": {
    "PlayerID": "8481019",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Alex Iafallo": {
    "PlayerID": "8480113",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Rasmus Kupari": {
    "PlayerID": "8480845",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Adam Lowry": {
    "PlayerID": "8476392",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Vladislav Namestnikov": {
    "PlayerID": "8476480",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Nino Niederreiter": {
    "PlayerID": "8475799",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Cole Perfetti": {
    "PlayerID": "8482149",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Mark Scheifele": {
    "PlayerID": "8476460",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Gabriel Vilardi": {
    "PlayerID": "8480014",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Dylan Coghlan": {
    "PlayerID": "8479639",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Dylan DeMelo": {
    "PlayerID": "8476331",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Haydn Fleury": {
    "PlayerID": "8477938",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Colin Miller": {
    "PlayerID": "8476525",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Josh Morrissey": {
    "PlayerID": "8477504",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Neal Pionk": {
    "PlayerID": "8480145",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Dylan Samberg": {
    "PlayerID": "8480049",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Logan Stanley": {
    "PlayerID": "8479378",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Eric Comrie": {
    "PlayerID": "8477480",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Connor Hellebuyck": {
    "PlayerID": "8476945",
    "TeamID": "52",
    "TeamAbbreviation": "WPG"
  },
  "Michael Carcone": {
    "PlayerID": "8479619",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Logan Cooley": {
    "PlayerID": "8483431",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Lawson Crouse": {
    "PlayerID": "8478474",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Josh Doan": {
    "PlayerID": "8482659",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Dylan Guenther": {
    "PlayerID": "8482699",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Barrett Hayton": {
    "PlayerID": "8480849",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Clayton Keller": {
    "PlayerID": "8479343",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Alex Kerfoot": {
    "PlayerID": "8477021",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Matias Maccelli": {
    "PlayerID": "8481711",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Jack McBain": {
    "PlayerID": "8480855",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Liam O'Brien": {
    "PlayerID": "8477070",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Nick Schmaltz": {
    "PlayerID": "8477951",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Kevin Stenlund": {
    "PlayerID": "8478831",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Kailer Yamamoto": {
    "PlayerID": "8479977",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Robert Bortuzzo": {
    "PlayerID": "8474145",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Ian Cole": {
    "PlayerID": "8474013",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Sean Durzi": {
    "PlayerID": "8480434",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Michael Kesselring": {
    "PlayerID": "8480891",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Vladislav Kolyachonok": {
    "PlayerID": "8481609",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Mikhail Sergachev": {
    "PlayerID": "8479410",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Juuso Valimaki": {
    "PlayerID": "8479976",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Connor Ingram": {
    "PlayerID": "8478971",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Karel Vejmelka": {
    "PlayerID": "8478872",
    "TeamID": "40",
    "TeamAbbreviation": "UTA"
  },
  "Nathan Bastian": {
    "PlayerID": "8479414",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Jesper Bratt": {
    "PlayerID": "8479407",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Paul Cotter": {
    "PlayerID": "8481032",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Erik Haula": {
    "PlayerID": "8475287",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Nico Hischier": {
    "PlayerID": "8480002",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Jack Hughes": {
    "PlayerID": "8481559",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Curtis Lazar": {
    "PlayerID": "8477508",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Kurtis MacDermid": {
    "PlayerID": "8477073",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Timo Meier": {
    "PlayerID": "8478414",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Dawson Mercer": {
    "PlayerID": "8482110",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Stefan Noesen": {
    "PlayerID": "8476474",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Ondrej Palat": {
    "PlayerID": "8476292",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Tomas Tatar": {
    "PlayerID": "8475193",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Seamus Casey": {
    "PlayerID": "8483429",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Brenden Dillon": {
    "PlayerID": "8475455",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Dougie Hamilton": {
    "PlayerID": "8476462",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Santeri Hatakka": {
    "PlayerID": "8481701",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Johnathan Kovacevic": {
    "PlayerID": "8480192",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Simon Nemec": {
    "PlayerID": "8483495",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Jonas Siegenthaler": {
    "PlayerID": "8478399",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Jake Allen": {
    "PlayerID": "8474596",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Jacob Markstrom": {
    "PlayerID": "8474593",
    "TeamID": "1",
    "TeamAbbreviation": "NJD"
  },
  "Max Domi": {
    "PlayerID": "8477503",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Pontus Holmberg": {
    "PlayerID": "8480995",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Calle Jarnkrok": {
    "PlayerID": "8475714",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "David Kampf": {
    "PlayerID": "8480144",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Matthew Knies": {
    "PlayerID": "8482720",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Steven Lorentz": {
    "PlayerID": "8478904",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Mitch Marner": {
    "PlayerID": "8478483",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Auston Matthews": {
    "PlayerID": "8479318",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Bobby McMann": {
    "PlayerID": "8482259",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "William Nylander": {
    "PlayerID": "8477939",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Max Pacioretty": {
    "PlayerID": "8474157",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Ryan Reaves": {
    "PlayerID": "8471817",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Nicholas Robertson": {
    "PlayerID": "8481582",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "John Tavares": {
    "PlayerID": "8475166",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Simon Benoit": {
    "PlayerID": "8481122",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Oliver Ekman-Larsson": {
    "PlayerID": "8475171",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Timothy Liljegren": {
    "PlayerID": "8480043",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Jake McCabe": {
    "PlayerID": "8476931",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Dakota Mermis": {
    "PlayerID": "8477541",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Philippe Myers": {
    "PlayerID": "8479026",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Morgan Rielly": {
    "PlayerID": "8476853",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Chris Tanev": {
    "PlayerID": "8475690",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Conor Timmins": {
    "PlayerID": "8479982",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Dennis Hildeby": {
    "PlayerID": "8483710",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Anthony Stolarz": {
    "PlayerID": "8476932",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Joseph Woll": {
    "PlayerID": "8479361",
    "TeamID": "10",
    "TeamAbbreviation": "TOR"
  },
  "Josh Anderson": {
    "PlayerID": "8476981",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Joel Armia": {
    "PlayerID": "8476469",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Alex Barré-Boulet": {
    "PlayerID": "8479718",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Cole Caufield": {
    "PlayerID": "8481540",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Kirby Dach": {
    "PlayerID": "8481523",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Christian Dvorak": {
    "PlayerID": "8477989",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Jake Evans": {
    "PlayerID": "8478133",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Brendan Gallagher": {
    "PlayerID": "8475848",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Emil Heineman": {
    "PlayerID": "8482476",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Oliver Kapanen": {
    "PlayerID": "8482775",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Alex Newhook": {
    "PlayerID": "8481618",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Michael Pezzetta": {
    "PlayerID": "8479543",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Juraj Slafkovsky": {
    "PlayerID": "8483515",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Nick Suzuki": {
    "PlayerID": "8480018",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Justin Barron": {
    "PlayerID": "8482111",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Kaiden Guhle": {
    "PlayerID": "8482087",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Lane Hutson": {
    "PlayerID": "8483457",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Mike Matheson": {
    "PlayerID": "8476875",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "David Savard": {
    "PlayerID": "8475233",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Jayden Struble": {
    "PlayerID": "8481593",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Arber Xhekaj": {
    "PlayerID": "8482964",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Sam Montembeault": {
    "PlayerID": "8478470",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "Cayden Primeau": {
    "PlayerID": "8480051",
        "TeamID": "8",
    "TeamAbbreviation": "MTL"
  },
  "John Beecher": {
    "PlayerID": "8481556",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Justin Brazeau": {
    "PlayerID": "8479638",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Charlie Coyle": {
    "PlayerID": "8475745",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Trent Frederic": {
    "PlayerID": "8479365",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Morgan Geekie": {
    "PlayerID": "8479987",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Max Jones": {
    "PlayerID": "8479368",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Mark Kastelic": {
    "PlayerID": "8480355",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Cole Koepke": {
    "PlayerID": "8481043",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Elias Lindholm": {
    "PlayerID": "8477496",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Brad Marchand": {
    "PlayerID": "8473419",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "David Pastrnak": {
    "PlayerID": "8477956",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Matthew Poitras": {
    "PlayerID": "8483505",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Riley Tufte": {
    "PlayerID": "8479362",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Pavel Zacha": {
    "PlayerID": "8478401",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Brandon Carlo": {
    "PlayerID": "8478443",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Hampus Lindholm": {
    "PlayerID": "8476854",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Mason Lohrei": {
    "PlayerID": "8482511",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Charlie McAvoy": {
    "PlayerID": "8479325",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Andrew Peeke": {
    "PlayerID": "8479369",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Parker Wotherspoon": {
    "PlayerID": "8478450",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Nikita Zadorov": {
    "PlayerID": "8477507",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Joonas Korpisalo": {
    "PlayerID": "8476914",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Jeremy Swayman": {
    "PlayerID": "8480280",
    "TeamID": "6",
    "TeamAbbreviation": "BOS"
  },
  "Zack Bolduc": {
    "PlayerID": "8482737",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Pavel Buchnevich": {
    "PlayerID": "8477402",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Radek Faksa": {
    "PlayerID": "8476889",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Dylan Holloway": {
    "PlayerID": "8482077",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Mathieu Joseph": {
    "PlayerID": "8478472",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Kasperi Kapanen": {
    "PlayerID": "8477953",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Jordan Kyrou": {
    "PlayerID": "8479385",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Jake Neighbours": {
    "PlayerID": "8482089",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Brandon Saad": {
    "PlayerID": "8476438",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Brayden Schenn": {
    "PlayerID": "8475170",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Alexandre Texier": {
    "PlayerID": "8480074",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Robert Thomas": {
    "PlayerID": "8480023",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Alexey Toropchenko": {
    "PlayerID": "8480281",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Nathan Walker": {
    "PlayerID": "8477573",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Philip Broberg": {
    "PlayerID": "8481598",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Justin Faulk": {
    "PlayerID": "8475753",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Pierre-Olivier Joseph": {
    "PlayerID": "8480058",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Matthew Kessel": {
    "PlayerID": "8482516",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Nick Leddy": {
    "PlayerID": "8475181",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Colton Parayko": {
    "PlayerID": "8476892",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Scott Perunovich": {
    "PlayerID": "8481059",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Ryan Suter": {
    "PlayerID": "8470600",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Jordan Binnington": {
    "PlayerID": "8476412",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Joel Hofer": {
    "PlayerID": "8480981",
    "TeamID": "19",
    "TeamAbbreviation": "STL"
  },
  "Matt Boldy": {
    "PlayerID": "8481557",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Travis Boyd": {
    "PlayerID": "8476329",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Joel Eriksson Ek": {
    "PlayerID": "8478493",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Marcus Foligno": {
    "PlayerID": "8475220",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Frederick Gaudreau": {
    "PlayerID": "8477919",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Ryan Hartman": {
    "PlayerID": "8477451",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Marcus Johansson": {
    "PlayerID": "8475149",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Kirill Kaprizov": {
    "PlayerID": "8478864",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Marat Khusnutdinov": {
    "PlayerID": "8482177",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Jakub Lauko": {
    "PlayerID": "8480880",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Liam Ohgren": {
    "PlayerID": "8483499",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Marco Rossi": {
    "PlayerID": "8482079",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Yakov Trenin": {
    "PlayerID": "8478508",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Mats Zuccarello": {
    "PlayerID": "8475692",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Zach Bogosian": {
    "PlayerID": "8474567",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Jonas Brodin": {
    "PlayerID": "8476463",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Declan Chisholm": {
    "PlayerID": "8480990",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Brock Faber": {
    "PlayerID": "8482122",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Jon Merrill": {
    "PlayerID": "8475750",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Jake Middleton": {
    "PlayerID": "8478136",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Jared Spurgeon": {
    "PlayerID": "8474716",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Marc-Andre Fleury": {
    "PlayerID": "8470594",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Filip Gustavsson": {
    "PlayerID": "8479406",
    "TeamID": "30",
    "TeamAbbreviation": "MIN"
  },
  "Jonny Brodzinski": {
    "PlayerID": "8477380",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Sam Carrick": {
    "PlayerID": "8475842",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Filip Chytil": {
    "PlayerID": "8480078",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Will Cuylle": {
    "PlayerID": "8482157",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Adam Edstrom": {
    "PlayerID": "8481726",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Kaapo Kakko": {
    "PlayerID": "8481554",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Chris Kreider": {
    "PlayerID": "8475184",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Alexis Lafrenière": {
    "PlayerID": "8482109",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Artemi Panarin": {
    "PlayerID": "8478550",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Matt Rempe": {
    "PlayerID": "8482460",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Reilly Smith": {
    "PlayerID": "8475191",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Vincent Trocheck": {
    "PlayerID": "8476389",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Jimmy Vesey": {
    "PlayerID": "8476918",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Mika Zibanejad": {
    "PlayerID": "8476459",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Adam Fox": {
    "PlayerID": "8479323",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Zac Jones": {
    "PlayerID": "8481708",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Ryan Lindgren": {
    "PlayerID": "8479324",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Victor Mancini": {
    "PlayerID": "8483768",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "K'Andre Miller": {
    "PlayerID": "8480817",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Chad Ruhwedel": {
    "PlayerID": "8477244",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Braden Schneider": {
    "PlayerID": "8482073",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Jacob Trouba": {
    "PlayerID": "8476885",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Jonathan Quick": {
    "PlayerID": "8471734",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Igor Shesterkin": {
    "PlayerID": "8478048",
    "TeamID": "3",
    "TeamAbbreviation": "NYR"
  },
  "Quinton Byfield": {
    "PlayerID": "8482124",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Phillip Danault": {
    "PlayerID": "8476479",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Kevin Fiala": {
    "PlayerID": "8477942",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Warren Foegele": {
    "PlayerID": "8477998",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Tanner Jeannot": {
    "PlayerID": "8479661",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Arthur Kaliyev": {
    "PlayerID": "8481560",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Adrian Kempe": {
    "PlayerID": "8477960",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Anze Kopitar": {
    "PlayerID": "8471685",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Alex Laferriere": {
    "PlayerID": "8482155",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Trevor Lewis": {
    "PlayerID": "8473453",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Trevor Moore": {
    "PlayerID": "8479675",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Akil Thomas": {
    "PlayerID": "8480851",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Alex Turcotte": {
    "PlayerID": "8481532",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Mikey Anderson": {
    "PlayerID": "8479998",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Kyle Burroughs": {
    "PlayerID": "8477335",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Brandt Clarke": {
    "PlayerID": "8482730",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Drew Doughty": {
    "PlayerID": "8474563",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Joel Edmundson": {
    "PlayerID": "8476441",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Andreas Englund": {
    "PlayerID": "8477971",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Vladislav Gavrikov": {
    "PlayerID": "8478882",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Caleb Jones": {
    "PlayerID": "8478452",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Jacob Moverare": {
    "PlayerID": "8479421",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Jordan Spence": {
    "PlayerID": "8481606",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Darcy Kuemper": {
    "PlayerID": "8475311",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "David Rittich": {
    "PlayerID": "8479496",
    "TeamID": "26",
    "TeamAbbreviation": "LAK"
  },
  "Joey Anderson": {
    "PlayerID": "8479315",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Andreas Athanasiou": {
    "PlayerID": "8476960",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Connor Bedard": {
    "PlayerID": "8484144",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Tyler Bertuzzi": {
    "PlayerID": "8477479",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Jason Dickinson": {
    "PlayerID": "8477450",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Ryan Donato": {
    "PlayerID": "8477987",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Nick Foligno": {
    "PlayerID": "8473422",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Taylor Hall": {
    "PlayerID": "8475791",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Philipp Kurashev": {
    "PlayerID": "8480798",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Patrick Maroon": {
    "PlayerID": "8474034",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Ilya Mikheyev": {
    "PlayerID": "8481624",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Frank Nazar": {
    "PlayerID": "8483493",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Lukas Reichel": {
    "PlayerID": "8482117",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Landon Slaggert": {
    "PlayerID": "8482172",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Craig Smith": {
    "PlayerID": "8475225",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Teuvo Teravainen": {
    "PlayerID": "8476882",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Nolan Allan": {
    "PlayerID": "8482700",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "TJ Brodie": {
    "PlayerID": "8474673",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Seth Jones": {
    "PlayerID": "8477495",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Wyatt Kaiser": {
    "PlayerID": "8482176",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Alec Martinez": {
    "PlayerID": "8474166",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Connor Murphy": {
    "PlayerID": "8476473",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Alex Vlasic": {
    "PlayerID": "8481568",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Petr Mrazek": {
    "PlayerID": "8475852",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Arvid Soderblom": {
    "PlayerID": "8482821",
    "TeamID": "16",
    "TeamAbbreviation": "CHI"
  },
  "Cameron Atkinson": {
    "PlayerID": "8474715",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Mitchell Chaffee": {
    "PlayerID": "8482070",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Anthony Cirelli": {
    "PlayerID": "8478519",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Conor Geekie": {
    "PlayerID": "8483447",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Zemgus Girgensons": {
    "PlayerID": "8476878",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Luke Glendening": {
    "PlayerID": "8476822",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Jake Guentzel": {
    "PlayerID": "8477404",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Brandon Hagel": {
    "PlayerID": "8479542",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Nikita Kucherov": {
    "PlayerID": "8476453",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Nicholas Paul": {
    "PlayerID": "8477426",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Brayden Point": {
    "PlayerID": "8478010",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Conor Sheary": {
    "PlayerID": "8477839",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Erik Cernak": {
    "PlayerID": "8478416",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Victor Hedman": {
    "PlayerID": "8475167",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Emil Lilleberg": {
    "PlayerID": "8482929",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Ryan McDonagh": {
    "PlayerID": "8474151",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Janis Moser": {
    "PlayerID": "8482655",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Nick Perbix": {
    "PlayerID": "8480246",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Darren Raddysh": {
    "PlayerID": "8478178",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Jonas Johansson": {
    "PlayerID": "8477992",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Andrei Vasilevskiy": {
    "PlayerID": "8476883",
    "TeamID": "14",
    "TeamAbbreviation": "TBL"
  },
  "Zach Aston-Reese": {
    "PlayerID": "8479944",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Gavin Brindley": {
    "PlayerID": "8484149",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Yegor Chinakhov": {
    "PlayerID": "8482475",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Adam Fantilli": {
    "PlayerID": "8484166",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Dylan Gambrell": {
    "PlayerID": "8479580",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Boone Jenner": {
    "PlayerID": "8476432",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Kent Johnson": {
    "PlayerID": "8482660",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Sean Kuraly": {
    "PlayerID": "8476374",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Kevin Labanc": {
    "PlayerID": "8478099",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Kirill Marchenko": {
    "PlayerID": "8480893",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Sean Monahan": {
    "PlayerID": "8477497",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Mathieu Olivier": {
    "PlayerID": "8479671",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Mikael Pyyhtia": {
    "PlayerID": "8482451",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Cole Sillinger": {
    "PlayerID": "8482705",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "James van Riemsdyk": {
    "PlayerID": "8474037",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Dmitri Voronkov": {
    "PlayerID": "8481716",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Jake Christiansen": {
    "PlayerID": "8481161",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Erik Gudbranson": {
    "PlayerID": "8475790",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Jordan Harris": {
    "PlayerID": "8480887",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "David Jiricek": {
    "PlayerID": "8483460",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Jack Johnson": {
    "PlayerID": "8471677",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Ivan Provorov": {
    "PlayerID": "8478500",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Damon Severson": {
    "PlayerID": "8476923",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Zach Werenski": {
    "PlayerID": "8478460",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Elvis Merzlikins": {
    "PlayerID": "8478007",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Daniil Tarasov": {
    "PlayerID": "8480193",
    "TeamID": "29",
    "TeamAbbreviation": "CBJ"
  },
  "Jonatan Berggren": {
    "PlayerID": "8481013",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "J.T. Compher": {
    "PlayerID": "8477456",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Andrew Copp": {
    "PlayerID": "8477429",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Alex DeBrincat": {
    "PlayerID": "8479337",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Christian Fischer": {
    "PlayerID": "8478432",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Patrick Kane": {
    "PlayerID": "8474141",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Dylan Larkin": {
    "PlayerID": "8477946",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Tyler Motte": {
    "PlayerID": "8477353",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Michael Rasmussen": {
    "PlayerID": "8479992",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Lucas Raymond": {
    "PlayerID": "8482078",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Vladimir Tarasenko": {
    "PlayerID": "8475765",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Joe Veleno": {
    "PlayerID": "8480813",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Ben Chiarot": {
    "PlayerID": "8475279",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Simon Edvinsson": {
    "PlayerID": "8482762",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Erik Gustafsson": {
    "PlayerID": "8476979",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Justin Holl": {
    "PlayerID": "8475718",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Albert Johansson": {
    "PlayerID": "8481607",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Olli Maatta": {
    "PlayerID": "8476874",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Jeff Petry": {
    "PlayerID": "8473507",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Moritz Seider": {
    "PlayerID": "8481542",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Ville Husso": {
    "PlayerID": "8478024",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Alex Lyon": {
    "PlayerID": "8479312",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Cam Talbot": {
    "PlayerID": "8475660",
    "TeamID": "17",
    "TeamAbbreviation": "DET"
  },
  "Leo Carlsson": {
    "PlayerID": "8484153",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Robby Fabbri": {
    "PlayerID": "8477952",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Cutter Gauthier": {
    "PlayerID": "8483445",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Ross Johnston": {
    "PlayerID": "8477527",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Alex Killorn": {
    "PlayerID": "8473986",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Brett Leason": {
    "PlayerID": "8481517",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Isac Lundestrom": {
    "PlayerID": "8480806",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Brock McGinn": {
    "PlayerID": "8476934",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Mason McTavish": {
    "PlayerID": "8482745",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Ryan Strome": {
    "PlayerID": "8476458",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Troy Terry": {
    "PlayerID": "8478873",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Frank Vatrano": {
    "PlayerID": "8478366",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Trevor Zegras": {
    "PlayerID": "8481533",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Brian Dumoulin": {
    "PlayerID": "8475208",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Cam Fowler": {
    "PlayerID": "8475764",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Radko Gudas": {
    "PlayerID": "8475462",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Jackson LaCombe": {
    "PlayerID": "8481605",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Tristan Luneau": {
    "PlayerID": "8483482",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Pavel Mintyukov": {
    "PlayerID": "8483490",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Urho Vaakanainen": {
    "PlayerID": "8480001",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Olen Zellweger": {
    "PlayerID": "8482803",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Lukas Dostal": {
    "PlayerID": "8480843",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "John Gibson": {
    "PlayerID": "8476434",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "James Reimer": {
    "PlayerID": "8473503",
    "TeamID": "24",
    "TeamAbbreviation": "ANA"
  },
  "Michael Amadio": {
    "PlayerID": "8478020",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Drake Batherson": {
    "PlayerID": "8480208",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Nick Cousins": {
    "PlayerID": "8476393",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Adam Gaudette": {
    "PlayerID": "8478874",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Claude Giroux": {
    "PlayerID": "8473512",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Noah Gregor": {
    "PlayerID": "8479393",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Ridly Greig": {
    "PlayerID": "8482092",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Matthew Highmore": {
    "PlayerID": "8478146",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Zack MacEwen": {
    "PlayerID": "8479772",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Josh Norris": {
    "PlayerID": "8480064",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "David Perron": {
    "PlayerID": "8474102",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Shane Pinto": {
    "PlayerID": "8481596",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Tim Stützle": {
    "PlayerID": "8482116",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Brady Tkachuk": {
    "PlayerID": "8480801",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Jacob Bernard-Docker": {
    "PlayerID": "8480879",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Thomas Chabot": {
    "PlayerID": "8478469",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Travis Hamonic": {
    "PlayerID": "8474612",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Nick Jensen": {
    "PlayerID": "8475324",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Tyler Kleven": {
    "PlayerID": "8482095",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Jake Sanderson": {
    "PlayerID": "8482105",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Artem Zub": {
    "PlayerID": "8482245",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Anton Forsberg": {
    "PlayerID": "8476341",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Mads Sogaard": {
    "PlayerID": "8481544",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Linus Ullmark": {
    "PlayerID": "8476999",
    "TeamID": "9",
    "TeamAbbreviation": "OTT"
  },
  "Bobby Brink": {
    "PlayerID": "8481553",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Noah Cates": {
    "PlayerID": "8480220",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Sean Couturier": {
    "PlayerID": "8476461",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Nicolas Deslauriers": {
    "PlayerID": "8475235",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Joel Farabee": {
    "PlayerID": "8480797",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Tyson Foerster": {
    "PlayerID": "8482159",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Morgan Frost": {
    "PlayerID": "8480028",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Garnet Hathaway": {
    "PlayerID": "8477903",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Travis Konecny": {
    "PlayerID": "8478439",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Scott Laughton": {
    "PlayerID": "8476872",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Jett Luchanko": {
    "PlayerID": "8484779",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Matvei Michkov": {
    "PlayerID": "8484387",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Ryan Poehling": {
    "PlayerID": "8480068",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Owen Tippett": {
    "PlayerID": "8480015",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Emil Andrae": {
    "PlayerID": "8482126",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Jamie Drysdale": {
    "PlayerID": "8482142",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Ryan Ellis": {
    "PlayerID": "8475176",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Erik Johnson": {
    "PlayerID": "8473446",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Rasmus Ristolainen": {
    "PlayerID": "8477499",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Travis Sanheim": {
    "PlayerID": "8477948",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Nick Seeler": {
    "PlayerID": "8476372",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Cam York": {
    "PlayerID": "8481546",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Egor Zamula": {
    "PlayerID": "8481178",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Samuel Ersson": {
    "PlayerID": "8481035",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Ivan Fedotov": {
    "PlayerID": "8478905",
    "TeamID": "4",
    "TeamAbbreviation": "PHI"
  },
  "Nils Aman": {
    "PlayerID": "8482496",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Arshdeep Bains": {
    "PlayerID": "8483395",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Teddy Blueger": {
    "PlayerID": "8476927",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Brock Boeser": {
    "PlayerID": "8478444",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Jake DeBrusk": {
    "PlayerID": "8478498",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Conor Garland": {
    "PlayerID": "8478856",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Danton Heinen": {
    "PlayerID": "8478046",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Nils Hoglander": {
    "PlayerID": "8481535",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "J.T. Miller": {
    "PlayerID": "8476468",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Elias Pettersson": {
    "PlayerID": "8480012",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Aatu Raty": {
    "PlayerID": "8482691",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Kiefer Sherwood": {
    "PlayerID": "8480748",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Daniel Sprong": {
    "PlayerID": "8478466",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Pius Suter": {
    "PlayerID": "8480459",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Vincent Desharnais": {
    "PlayerID": "8479576",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Derek Forbort": {
    "PlayerID": "8475762",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Filip Hronek": {
    "PlayerID": "8479425",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Quinn Hughes": {
    "PlayerID": "8480800",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Noah Juulsen": {
    "PlayerID": "8478454",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Tyler Myers": {
    "PlayerID": "8474574",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Carson Soucy": {
    "PlayerID": "8477369",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Kevin Lankinen": {
    "PlayerID": "8480947",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Arturs Silovs": {
    "PlayerID": "8481668",
    "TeamID": "23",
    "TeamAbbreviation": "VAN"
  },
  "Aleksander Barkov": {
    "PlayerID": "8477493",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Sam Bennett": {
    "PlayerID": "8477935",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Jesper Boqvist": {
    "PlayerID": "8480003",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Jonah Gadjovich": {
    "PlayerID": "8479981",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Patrick Giles": {
    "PlayerID": "8480825",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "A.J. Greer": {
    "PlayerID": "8478421",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Anton Lundell": {
    "PlayerID": "8482113",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Eetu Luostarinen": {
    "PlayerID": "8480185",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Tomas Nosek": {
    "PlayerID": "8477931",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Sam Reinhart": {
    "PlayerID": "8477933",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Evan Rodrigues": {
    "PlayerID": "8478542",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Mackie Samoskevich": {
    "PlayerID": "8482713",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Matthew Tkachuk": {
    "PlayerID": "8479314",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Carter Verhaeghe": {
    "PlayerID": "8477409",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Uvis Balinskis": {
    "PlayerID": "8484304",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Adam Boqvist": {
    "PlayerID": "8480871",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Aaron Ekblad": {
    "PlayerID": "8477932",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Gustav Forsling": {
    "PlayerID": "8478055",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Dmitry Kulikov": {
    "PlayerID": "8475179",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Niko Mikkola": {
    "PlayerID": "8478859",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Nate Schmidt": {
    "PlayerID": "8477220",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Sergei Bobrovsky": {
    "PlayerID": "8475683",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Spencer Knight": {
    "PlayerID": "8481519",
    "TeamID": "13",
    "TeamAbbreviation": "FLA"
  },
  "Noel Acciari": {
    "PlayerID": "8478569",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Anthony Beauvillier": {
    "PlayerID": "8478463",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Michael Bunting": {
    "PlayerID": "8478047",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Sidney Crosby": {
    "PlayerID": "8471675",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Lars Eller": {
    "PlayerID": "8474189",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Cody Glass": {
    "PlayerID": "8479996",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Kevin Hayes": {
    "PlayerID": "8475763",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Blake Lizotte": {
    "PlayerID": "8481481",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Evgeni Malkin": {
    "PlayerID": "8471215",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Rutger McGroarty": {
    "PlayerID": "8483487",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Matt Nieto": {
    "PlayerID": "8476442",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Drew O'Connor": {
    "PlayerID": "8482055",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Jesse Puljujarvi": {
    "PlayerID": "8479344",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Valtteri Puustinen": {
    "PlayerID": "8481703",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Rickard Rakell": {
    "PlayerID": "8476483",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Bryan Rust": {
    "PlayerID": "8475810",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Ryan Graves": {
    "PlayerID": "8477435",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Matt Grzelcyk": {
    "PlayerID": "8476891",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Erik Karlsson": {
    "PlayerID": "8474578",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Kris Letang": {
    "PlayerID": "8471724",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Marcus Pettersson": {
    "PlayerID": "8477969",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Ryan Shea": {
    "PlayerID": "8478854",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Jack St. Ivany": {
    "PlayerID": "8481030",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Joel Blomqvist": {
    "PlayerID": "8482446",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Tristan Jarry": {
    "PlayerID": "8477465",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Alex Nedeljkovic": {
    "PlayerID": "8477968",
    "TeamID": "5",
    "TeamAbbreviation": "PIT"
  },
  "Matty Beniers": {
    "PlayerID": "8482665",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Oliver Bjorkstrand": {
    "PlayerID": "8477416",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Andre Burakovsky": {
    "PlayerID": "8477444",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Jordan Eberle": {
    "PlayerID": "8474586",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Yanni Gourde": {
    "PlayerID": "8476826",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Tye Kartye": {
    "PlayerID": "8481789",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Jared McCann": {
    "PlayerID": "8477955",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Jaden Schwartz": {
    "PlayerID": "8475768",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Chandler Stephenson": {
    "PlayerID": "8476905",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Brandon Tanev": {
    "PlayerID": "8479293",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Eeli Tolvanen": {
    "PlayerID": "8480009",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Shane Wright": {
    "PlayerID": "8483524",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Will Borgen": {
    "PlayerID": "8478840",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Vince Dunn": {
    "PlayerID": "8478407",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Ryker Evans": {
    "PlayerID": "8482858",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Adam Larsson": {
    "PlayerID": "8476457",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Joshua Mahura": {
    "PlayerID": "8479372",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Brandon Montour": {
    "PlayerID": "8477986",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Jamie Oleksiak": {
    "PlayerID": "8476467",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Joey Daccord": {
    "PlayerID": "8478916",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Philipp Grubauer": {
    "PlayerID": "8475831",
    "TeamID": "55",
    "TeamAbbreviation": "SEA"
  },
  "Nicolas Aube-Kubel": {
    "PlayerID": "8477979",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Zach Benson": {
    "PlayerID": "8484145",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Dylan Cozens": {
    "PlayerID": "8481528",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Jordan Greenway": {
    "PlayerID": "8478413",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Peyton Krebs": {
    "PlayerID": "8481522",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Jiri Kulich": {
    "PlayerID": "8483468",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Sam Lafferty": {
    "PlayerID": "8478043",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Beck Malenstyn": {
    "PlayerID": "8479359",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Ryan McLeod": {
    "PlayerID": "8480802",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "JJ Peterka": {
    "PlayerID": "8482175",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Jack Quinn": {
    "PlayerID": "8482097",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Tage Thompson": {
    "PlayerID": "8479420",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Alex Tuch": {
    "PlayerID": "8477949",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Jason Zucker": {
    "PlayerID": "8475722",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Jacob Bryson": {
    "PlayerID": "8480196",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Bowen Byram": {
    "PlayerID": "8481524",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Connor Clifton": {
    "PlayerID": "8477365",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Rasmus Dahlin": {
    "PlayerID": "8480839",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Dennis Gilbert": {
    "PlayerID": "8478502",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Henri Jokiharju": {
    "PlayerID": "8480035",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Owen Power": {
    "PlayerID": "8482671",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Mattias Samuelsson": {
    "PlayerID": "8480807",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Devon Levi": {
    "PlayerID": "8482221",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Ukko-Pekka Luukkonen": {
    "PlayerID": "8480045",
    "TeamID": "7",
    "TeamAbbreviation": "BUF"
  },
  "Thomas Bordeleau": {
    "PlayerID": "8482133",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Macklin Celebrini": {
    "PlayerID": "8484801",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Logan Couture": {
    "PlayerID": "8474053",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Ty Dellandrea": {
    "PlayerID": "8480848",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "William Eklund": {
    "PlayerID": "8482667",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Barclay Goodrow": {
    "PlayerID": "8476624",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Mikael Granlund": {
    "PlayerID": "8475798",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Carl Grundstrom": {
    "PlayerID": "8479336",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Danil Gushchin": {
    "PlayerID": "8482101",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Klim Kostin": {
    "PlayerID": "8480011",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Luke Kunin": {
    "PlayerID": "8479316",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Givani Smith": {
    "PlayerID": "8479379",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Will Smith": {
    "PlayerID": "8484227",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Nico Sturm": {
    "PlayerID": "8481477",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Tyler Toffoli": {
    "PlayerID": "8475726",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Alexander Wennberg": {
    "PlayerID": "8477505",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Fabian Zetterlund": {
    "PlayerID": "8480188",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Matt Benning": {
    "PlayerID": "8476988",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Cody Ceci": {
    "PlayerID": "8476879",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Mario Ferraro": {
    "PlayerID": "8479983",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Jan Rutta": {
    "PlayerID": "8480172",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Jack Thompson": {
    "PlayerID": "8482144",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Henry Thrun": {
    "PlayerID": "8481567",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Jake Walman": {
    "PlayerID": "8478013",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Mackenzie Blackwood": {
    "PlayerID": "8478406",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Vitek Vanecek": {
    "PlayerID": "8477970",
    "TeamID": "28",
    "TeamAbbreviation": "SJS"
  },
  "Mathew Barzal": {
    "PlayerID": "8478445",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Casey Cizikas": {
    "PlayerID": "8475231",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Anthony Duclair": {
    "PlayerID": "8477407",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Julien Gauthier": {
    "PlayerID": "8479328",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Simon Holmstrom": {
    "PlayerID": "8481601",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Bo Horvat": {
    "PlayerID": "8477500",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Anders Lee": {
    "PlayerID": "8475314",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Kyle MacLean": {
    "PlayerID": "8481237",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Brock Nelson": {
    "PlayerID": "8475754",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Jean-Gabriel Pageau": {
    "PlayerID": "8476419",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Kyle Palmieri": {
    "PlayerID": "8475151",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Maxim Tsyplakov": {
    "PlayerID": "8484958",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Oliver Wahlstrom": {
    "PlayerID": "8480789",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Dennis Cholowski": {
    "PlayerID": "8479395",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Noah Dobson": {
    "PlayerID": "8480865",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Scott Mayfield": {
    "PlayerID": "8476429",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Adam Pelech": {
    "PlayerID": "8476917",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Ryan Pulock": {
    "PlayerID": "8477506",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Mike Reilly": {
    "PlayerID": "8476422",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Alexander Romanov": {
    "PlayerID": "8481014",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Ilya Sorokin": {
    "PlayerID": "8478009",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Semyon Varlamov": {
    "PlayerID": "8473575",
    "TeamID": "2",
    "TeamAbbreviation": "NYI"
  },
  "Nicklas Backstrom": {
    "PlayerID": "8473563",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Nic Dowd": {
    "PlayerID": "8475343",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Pierre-Luc Dubois": {
    "PlayerID": "8479400",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Brandon Duhaime": {
    "PlayerID": "8479520",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Hendrix Lapierre": {
    "PlayerID": "8482148",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Andrew Mangiapane": {
    "PlayerID": "8478233",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Connor McMichael": {
    "PlayerID": "8481580",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Sonny Milano": {
    "PlayerID": "8477947",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Ivan Miroshnichenko": {
    "PlayerID": "8483491",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Alex Ovechkin": {
    "PlayerID": "8471214",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Aliaksei Protas": {
    "PlayerID": "8481656",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Taylor Raddysh": {
    "PlayerID": "8479390",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Dylan Strome": {
    "PlayerID": "8478440",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Jakub Vrana": {
    "PlayerID": "8477944",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Tom Wilson": {
    "PlayerID": "8476880",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Alexander Alexeyev": {
    "PlayerID": "8480823",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Ethan Bear": {
    "PlayerID": "8478451",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "John Carlson": {
    "PlayerID": "8474590",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Jakob Chychrun": {
    "PlayerID": "8479345",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Martin Fehervary": {
    "PlayerID": "8480796",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Matt Roy": {
    "PlayerID": "8478911",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Rasmus Sandin": {
    "PlayerID": "8480873",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Trevor van Riemsdyk": {
    "PlayerID": "8477845",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Charlie Lindgren": {
    "PlayerID": "8479292",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Logan Thompson": {
    "PlayerID": "8480313",
    "TeamID": "15",
    "TeamAbbreviation": "WSH"
  },
  "Sebastian Aho": {
    "PlayerID": "8478427",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Jackson Blake": {
    "PlayerID": "8482809",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "William Carrier": {
    "PlayerID": "8477478",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Jack Drury": {
    "PlayerID": "8480835",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Seth Jarvis": {
    "PlayerID": "8482093",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Jesperi Kotkaniemi": {
    "PlayerID": "8480829",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Brendan Lemieux": {
    "PlayerID": "8477962",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Jordan Martinook": {
    "PlayerID": "8476921",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Martin Necas": {
    "PlayerID": "8480039",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Eric Robinson": {
    "PlayerID": "8480762",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Jack Roslovic": {
    "PlayerID": "8478458",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Jordan Staal": {
    "PlayerID": "8473533",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Andrei Svechnikov": {
    "PlayerID": "8480830",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Brent Burns": {
    "PlayerID": "8470613",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Jalen Chatfield": {
    "PlayerID": "8478970",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Shayne Gostisbehere": {
    "PlayerID": "8476906",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Dmitry Orlov": {
    "PlayerID": "8475200",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Jaccob Slavin": {
    "PlayerID": "8476958",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Riley Stillman": {
    "PlayerID": "8479388",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Sean Walker": {
    "PlayerID": "8480336",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Frederik Andersen": {
    "PlayerID": "8475883",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Pyotr Kochetkov": {
    "PlayerID": "8481611",
    "TeamID": "12",
    "TeamAbbreviation": "CAR"
  },
  "Luke Evangelista": {
    "PlayerID": "8482146",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Filip Forsberg": {
    "PlayerID": "8476887",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Mark Jankowski": {
    "PlayerID": "8476873",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Jonathan Marchessault": {
    "PlayerID": "8476539",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Michael McCarron": {
    "PlayerID": "8477446",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Tommy Novak": {
    "PlayerID": "8478438",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Gustav Nyquist": {
    "PlayerID": "8474679",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Ryan O'Reilly": {
    "PlayerID": "8475158",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Juuso Parssinen": {
    "PlayerID": "8481704",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Colton Sissons": {
    "PlayerID": "8476925",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Cole Smith": {
    "PlayerID": "8482062",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Steven Stamkos": {
    "PlayerID": "8474564",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Philip Tomasino": {
    "PlayerID": "8481577",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Alexandre Carrier": {
    "PlayerID": "8478851",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Dante Fabbro": {
    "PlayerID": "8479371",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Roman Josi": {
    "PlayerID": "8474600",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Jeremy Lauzon": {
    "PlayerID": "8478468",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Luke Schenn": {
    "PlayerID": "8474568",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Brady Skjei": {
    "PlayerID": "8476869",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Juuse Saros": {
    "PlayerID": "8477424",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Scott Wedgewood": {
    "PlayerID": "8475809",
    "TeamID": "18",
    "TeamAbbreviation": "NSH"
  },
  "Ross Colton": {
    "PlayerID": "8479525",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Maxmilian Curran": {
    "PlayerID": "8484846",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Jonathan Drouin": {
    "PlayerID": "8477494",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Ivan Ivan": {
    "PlayerID": "8483930",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Parker Kelly": {
    "PlayerID": "8480448",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Joel Kiviranta": {
    "PlayerID": "8481641",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Nikolai Kovalenko": {
    "PlayerID": "8481042",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Nathan MacKinnon": {
    "PlayerID": "8477492",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Casey Mittelstadt": {
    "PlayerID": "8479999",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Logan O'Connor": {
    "PlayerID": "8481186",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Mikko Rantanen": {
    "PlayerID": "8478420",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Calum Ritchie": {
    "PlayerID": "8484221",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Chris Wagner": {
    "PlayerID": "8475780",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Miles Wood": {
    "PlayerID": "8477425",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Calvin de Haan": {
    "PlayerID": "8475177",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Samuel Girard": {
    "PlayerID": "8479398",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Oliver Kylington": {
    "PlayerID": "8478430",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "John Ludvig": {
    "PlayerID": "8481206",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Cale Makar": {
    "PlayerID": "8480069",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Sam Malinski": {
    "PlayerID": "8484258",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Josh Manson": {
    "PlayerID": "8476312",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Devon Toews": {
    "PlayerID": "8478038",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Justus Annunen": {
    "PlayerID": "8481020",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Alexandar Georgiev": {
    "PlayerID": "8480382",
    "TeamID": "21",
    "TeamAbbreviation": "COL"
  },
  "Viktor Arvidsson": {
    "PlayerID": "8478042",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Connor Brown": {
    "PlayerID": "8477015",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Leon Draisaitl": {
    "PlayerID": "8477934",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Adam Henrique": {
    "PlayerID": "8474641",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Zach Hyman": {
    "PlayerID": "8475786",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Mattias Janmark": {
    "PlayerID": "8477406",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Connor McDavid": {
    "PlayerID": "8478402",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Ryan Nugent-Hopkins": {
    "PlayerID": "8476454",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Corey Perry": {
    "PlayerID": "8470621",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Vasily Podkolzin": {
    "PlayerID": "8481617",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Derek Ryan": {
    "PlayerID": "8478585",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Jeff Skinner": {
    "PlayerID": "8475784",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Evan Bouchard": {
    "PlayerID": "8480803",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Travis Dermott": {
    "PlayerID": "8478408",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Mattias Ekholm": {
    "PlayerID": "8475218",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Ty Emberson": {
    "PlayerID": "8480834",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Brett Kulak": {
    "PlayerID": "8476967",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Darnell Nurse": {
    "PlayerID": "8477498",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Troy Stecher": {
    "PlayerID": "8479442",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Calvin Pickard": {
    "PlayerID": "8475717",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  },
  "Stuart Skinner": {
    "PlayerID": "8479973",
    "TeamID": "22",
    "TeamAbbreviation": "EDM"
  }
};

export interface GamePrediction {
  winningTeam: string | null;
  confidence: number;
  defaultOdds: number;
}

export interface OverDogPicksProps {
  games: NHLGame[];
  oddsFormat: OddsFormat;
}

export interface BetData {
  sport: string;
  league: string;
  team: string;
  odds: string;
  type: string;
  prediction: string;
  stake: string;
  betType:string,
}

export interface BetTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: BetData | null;
}

export interface Period {
  period: number;
  periodType: string;  // 'REGULAR', 'OVERTIME', 'SHOOTOUT'
  homeScore: number;
  awayScore: number;
}

// types/nhl.ts
export interface Linescore {
  value: number;
}

export interface Team {
  teamId: string;
  teamName: string;
  score: number;
  record?: string;
  shotsOnGoal?: number;
  linescores?: Array<{value: number}>;
}

// types/nhl.ts
export interface NHLGame {
  GameID: number;
  "Game State": string;
  "Home Team": string;
  "Home Goals": number;
  "Away Goals": number;
  "Away Team": string;
  "Pre-Game Home Win Probability": string;
  "Pre-Game Away Win Probability": string;
  "Home Record": string;
  "Away Record": string;
}

export type OddsFormat = 'american' | 'european';

export const convertOdds = (americanOdds: number, format: OddsFormat): string => {
  if (format === 'american') return americanOdds.toString();
  
  if (americanOdds > 0) {
    return ((americanOdds / 100) + 1).toFixed(2);
  }
  return ((-100 / americanOdds) + 1).toFixed(2);
};

export interface ScoreboardData {
  gameDate: string;
  games: NHLGame[];
}

export interface APIResponse {
  meta: {
    version: number;
    request: string;
    time: string;
    code: number;
  };
  scoreboard: ScoreboardData;
}
