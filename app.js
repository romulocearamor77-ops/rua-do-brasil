const galleryKey = "ruaBrasilGaleria";
const quotaKey = "ruaBrasilCotas";
const expenseKey = "ruaBrasilDespesas";
const betKey = "ruaBrasilBolao";
const resultKey = "ruaBrasilResultados";
const accessKey = "ruaBrasilAccessMode";
const config = window.RUA_BRASIL_CONFIG || {};
const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase);
const hasJsonBlob = Boolean(config.jsonBlobUrl);
const hasCloudinary = Boolean(config.cloudinaryCloudName && config.cloudinaryUploadPreset);
const maxVideoSeconds = Number(config.maxVideoSeconds || 30);
const db = hasSupabase
  ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

const mediaForm = document.querySelector("#mediaForm");
const mediaFile = document.querySelector("#mediaFile");
const mediaLink = document.querySelector("#mediaLink");
const mediaYear = document.querySelector("#mediaYear");
const mediaCaption = document.querySelector("#mediaCaption");
const yearFilter = document.querySelector("#yearFilter");
const galleryGrid = document.querySelector("#galleryGrid");
const clearGallery = document.querySelector("#clearGallery");
const connectionStatus = document.querySelector("#connectionStatus");
const openFullSchedule = document.querySelector("#openFullSchedule");
const fullScheduleNavLink = document.querySelector("#fullScheduleNavLink");
const fullScheduleModal = document.querySelector("#fullScheduleModal");
const closeFullSchedule = document.querySelector("#closeFullSchedule");
const closeFullScheduleButton = document.querySelector("#closeFullScheduleButton");
const fullScheduleStageFilter = document.querySelector("#fullScheduleStageFilter");
const fullScheduleSearch = document.querySelector("#fullScheduleSearch");
const fullScheduleRows = document.querySelector("#fullScheduleRows");
const fullScheduleCount = document.querySelector("#fullScheduleCount");
const fullScheduleVenueCount = document.querySelector("#fullScheduleVenueCount");
const matchGrid = document.querySelector("#matchGrid");
const poolStats = document.querySelector("#poolStats");
const betForm = document.querySelector("#betForm");
const bettorName = document.querySelector("#bettorName");
const betMatchList = document.querySelector("#betMatchList");
const resultsForm = document.querySelector("#resultsForm");
const resultsList = document.querySelector("#resultsList");
const rankingRows = document.querySelector("#rankingRows");
const rankingPodium = document.querySelector("#rankingPodium");
const betAdminRows = document.querySelector("#betAdminRows");

const quotaForm = document.querySelector("#quotaForm");
const quotaName = document.querySelector("#quotaName");
const quotaValue = document.querySelector("#quotaValue");
const quotaPaid = document.querySelector("#quotaPaid");
const quotaRows = document.querySelector("#quotaRows");
const quotaSummary = document.querySelector("#quotaSummary");
const expenseForm = document.querySelector("#expenseForm");
const expenseDate = document.querySelector("#expenseDate");
const expenseCategory = document.querySelector("#expenseCategory");
const expenseValue = document.querySelector("#expenseValue");
const expenseDescription = document.querySelector("#expenseDescription");
const expenseReceipt = document.querySelector("#expenseReceipt");
const expenseRows = document.querySelector("#expenseRows");
const financeSummary = document.querySelector("#financeSummary");
const expenseCategoryBars = document.querySelector("#expenseCategoryBars");
const financeInsights = document.querySelector("#financeInsights");
const loginScreen = document.querySelector("#loginScreen");
const visitorAccess = document.querySelector("#visitorAccess");
const adminAccess = document.querySelector("#adminAccess");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminPassword = document.querySelector("#adminPassword");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const nextMatchCountdown = document.querySelector("#nextMatchCountdown");

let gallery = [];
let quotas = [];
let expenses = [];
let bets = [];
let officialResults = {};
let accessMode = localStorage.getItem(accessKey) === "admin" ? "admin" : "";
const scheduleKey = "ruaBrasilTabelaCompleta";
const scheduleVersionKey = "ruaBrasilTabelaCompletaVersao";
const scheduleVersion = "2026-05-27-v4";
const fullScheduleSeed = [
  {
    "matchNumber": 1,
    "stage": "Fase de grupos",
    "date": "2026-06-11",
    "displayDate": "11/06/2026",
    "displayTime": "16:00",
    "weekday": "quinta-feira",
    "homeTeam": "Mexico",
    "awayTeam": "South Africa",
    "stadium": "Estadio Azteca",
    "city": "Mexico City",
    "sourceUtc": "2026-06-11T19:00:00+00:00"
  },
  {
    "matchNumber": 2,
    "stage": "Fase de grupos",
    "date": "2026-06-11",
    "displayDate": "11/06/2026",
    "displayTime": "23:00",
    "weekday": "quinta-feira",
    "homeTeam": "South Korea",
    "awayTeam": "Czech Republic",
    "stadium": "Estadio Akron",
    "city": "Guadalajara",
    "sourceUtc": "2026-06-12T02:00:00+00:00"
  },
  {
    "matchNumber": 3,
    "stage": "Fase de grupos",
    "date": "2026-06-12",
    "displayDate": "12/06/2026",
    "displayTime": "16:00",
    "weekday": "sexta-feira",
    "homeTeam": "Canada",
    "awayTeam": "Bosnia and Herzegovina",
    "stadium": "BMO Field",
    "city": "Toronto",
    "sourceUtc": "2026-06-12T19:00:00+00:00"
  },
  {
    "matchNumber": 4,
    "stage": "Fase de grupos",
    "date": "2026-06-12",
    "displayDate": "12/06/2026",
    "displayTime": "22:00",
    "weekday": "sexta-feira",
    "homeTeam": "United States",
    "awayTeam": "Paraguay",
    "stadium": "SoFi Stadium",
    "city": "Los Angeles",
    "sourceUtc": "2026-06-13T01:00:00+00:00"
  },
  {
    "matchNumber": 5,
    "stage": "Fase de grupos",
    "date": "2026-06-13",
    "displayDate": "13/06/2026",
    "displayTime": "22:00",
    "weekday": "sabado",
    "homeTeam": "Haiti",
    "awayTeam": "Scotland",
    "stadium": "Gillette Stadium",
    "city": "Boston",
    "sourceUtc": "2026-06-14T01:00:00+00:00"
  },
  {
    "matchNumber": 6,
    "stage": "Fase de grupos",
    "date": "2026-06-14",
    "displayDate": "14/06/2026",
    "displayTime": "01:00",
    "weekday": "domingo",
    "homeTeam": "Australia",
    "awayTeam": "Turkey",
    "stadium": "BC Place",
    "city": "Vancouver",
    "sourceUtc": "2026-06-14T04:00:00+00:00"
  },
  {
    "matchNumber": 7,
    "stage": "Fase de grupos",
    "date": "2026-06-13",
    "displayDate": "13/06/2026",
    "displayTime": "19:00",
    "weekday": "sabado",
    "homeTeam": "Brazil",
    "awayTeam": "Morocco",
    "stadium": "MetLife Stadium",
    "city": "New York / New Jersey",
    "sourceUtc": "2026-06-13T22:00:00+00:00"
  },
  {
    "matchNumber": 8,
    "stage": "Fase de grupos",
    "date": "2026-06-13",
    "displayDate": "13/06/2026",
    "displayTime": "16:00",
    "weekday": "sabado",
    "homeTeam": "Qatar",
    "awayTeam": "Switzerland",
    "stadium": "Levi's Stadium",
    "city": "San Francisco Bay Area",
    "sourceUtc": "2026-06-13T19:00:00+00:00"
  },
  {
    "matchNumber": 9,
    "stage": "Fase de grupos",
    "date": "2026-06-14",
    "displayDate": "14/06/2026",
    "displayTime": "20:00",
    "weekday": "domingo",
    "homeTeam": "Ivory Coast",
    "awayTeam": "Ecuador",
    "stadium": "Lincoln Financial Field",
    "city": "Philadelphia",
    "sourceUtc": "2026-06-14T23:00:00+00:00"
  },
  {
    "matchNumber": 10,
    "stage": "Fase de grupos",
    "date": "2026-06-14",
    "displayDate": "14/06/2026",
    "displayTime": "14:00",
    "weekday": "domingo",
    "homeTeam": "Germany",
    "awayTeam": "Curaçao",
    "stadium": "NRG Stadium",
    "city": "Houston",
    "sourceUtc": "2026-06-14T17:00:00+00:00"
  },
  {
    "matchNumber": 11,
    "stage": "Fase de grupos",
    "date": "2026-06-14",
    "displayDate": "14/06/2026",
    "displayTime": "17:00",
    "weekday": "domingo",
    "homeTeam": "Netherlands",
    "awayTeam": "Japan",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-06-14T20:00:00+00:00"
  },
  {
    "matchNumber": 12,
    "stage": "Fase de grupos",
    "date": "2026-06-14",
    "displayDate": "14/06/2026",
    "displayTime": "23:00",
    "weekday": "domingo",
    "homeTeam": "Sweden",
    "awayTeam": "Tunisia",
    "stadium": "Estadio BBVA",
    "city": "Monterrey",
    "sourceUtc": "2026-06-15T02:00:00+00:00"
  },
  {
    "matchNumber": 13,
    "stage": "Fase de grupos",
    "date": "2026-06-15",
    "displayDate": "15/06/2026",
    "displayTime": "19:00",
    "weekday": "segunda-feira",
    "homeTeam": "Saudi Arabia",
    "awayTeam": "Uruguay",
    "stadium": "Hard Rock Stadium",
    "city": "Miami",
    "sourceUtc": "2026-06-15T22:00:00+00:00"
  },
  {
    "matchNumber": 14,
    "stage": "Fase de grupos",
    "date": "2026-06-15",
    "displayDate": "15/06/2026",
    "displayTime": "13:00",
    "weekday": "segunda-feira",
    "homeTeam": "Spain",
    "awayTeam": "Cape Verde",
    "stadium": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "sourceUtc": "2026-06-15T16:00:00+00:00"
  },
  {
    "matchNumber": 15,
    "stage": "Fase de grupos",
    "date": "2026-06-15",
    "displayDate": "15/06/2026",
    "displayTime": "22:00",
    "weekday": "segunda-feira",
    "homeTeam": "Iran",
    "awayTeam": "New Zealand",
    "stadium": "SoFi Stadium",
    "city": "Los Angeles",
    "sourceUtc": "2026-06-16T01:00:00+00:00"
  },
  {
    "matchNumber": 16,
    "stage": "Fase de grupos",
    "date": "2026-06-15",
    "displayDate": "15/06/2026",
    "displayTime": "16:00",
    "weekday": "segunda-feira",
    "homeTeam": "Belgium",
    "awayTeam": "Egypt",
    "stadium": "Lumen Field",
    "city": "Seattle",
    "sourceUtc": "2026-06-15T19:00:00+00:00"
  },
  {
    "matchNumber": 17,
    "stage": "Fase de grupos",
    "date": "2026-06-16",
    "displayDate": "16/06/2026",
    "displayTime": "16:00",
    "weekday": "terca-feira",
    "homeTeam": "France",
    "awayTeam": "Senegal",
    "stadium": "MetLife Stadium",
    "city": "New York / New Jersey",
    "sourceUtc": "2026-06-16T19:00:00+00:00"
  },
  {
    "matchNumber": 18,
    "stage": "Fase de grupos",
    "date": "2026-06-16",
    "displayDate": "16/06/2026",
    "displayTime": "19:00",
    "weekday": "terca-feira",
    "homeTeam": "Iraq",
    "awayTeam": "Norway",
    "stadium": "Gillette Stadium",
    "city": "Boston",
    "sourceUtc": "2026-06-16T22:00:00+00:00"
  },
  {
    "matchNumber": 19,
    "stage": "Fase de grupos",
    "date": "2026-06-16",
    "displayDate": "16/06/2026",
    "displayTime": "22:00",
    "weekday": "terca-feira",
    "homeTeam": "Argentina",
    "awayTeam": "Algeria",
    "stadium": "Arrowhead Stadium",
    "city": "Kansas City",
    "sourceUtc": "2026-06-17T01:00:00+00:00"
  },
  {
    "matchNumber": 20,
    "stage": "Fase de grupos",
    "date": "2026-06-17",
    "displayDate": "17/06/2026",
    "displayTime": "01:00",
    "weekday": "quarta-feira",
    "homeTeam": "Austria",
    "awayTeam": "Jordan",
    "stadium": "Levi's Stadium",
    "city": "San Francisco Bay Area",
    "sourceUtc": "2026-06-17T04:00:00+00:00"
  },
  {
    "matchNumber": 21,
    "stage": "Fase de grupos",
    "date": "2026-06-17",
    "displayDate": "17/06/2026",
    "displayTime": "20:00",
    "weekday": "quarta-feira",
    "homeTeam": "Ghana",
    "awayTeam": "Panama",
    "stadium": "BMO Field",
    "city": "Toronto",
    "sourceUtc": "2026-06-17T23:00:00+00:00"
  },
  {
    "matchNumber": 22,
    "stage": "Fase de grupos",
    "date": "2026-06-17",
    "displayDate": "17/06/2026",
    "displayTime": "17:00",
    "weekday": "quarta-feira",
    "homeTeam": "England",
    "awayTeam": "Croatia",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-06-17T20:00:00+00:00"
  },
  {
    "matchNumber": 23,
    "stage": "Fase de grupos",
    "date": "2026-06-17",
    "displayDate": "17/06/2026",
    "displayTime": "14:00",
    "weekday": "quarta-feira",
    "homeTeam": "Portugal",
    "awayTeam": "DR Congo",
    "stadium": "NRG Stadium",
    "city": "Houston",
    "sourceUtc": "2026-06-17T17:00:00+00:00"
  },
  {
    "matchNumber": 24,
    "stage": "Fase de grupos",
    "date": "2026-06-17",
    "displayDate": "17/06/2026",
    "displayTime": "23:00",
    "weekday": "quarta-feira",
    "homeTeam": "Uzbekistan",
    "awayTeam": "Colombia",
    "stadium": "Estadio Azteca",
    "city": "Mexico City",
    "sourceUtc": "2026-06-18T02:00:00+00:00"
  },
  {
    "matchNumber": 25,
    "stage": "Fase de grupos",
    "date": "2026-06-18",
    "displayDate": "18/06/2026",
    "displayTime": "13:00",
    "weekday": "quinta-feira",
    "homeTeam": "Czech Republic",
    "awayTeam": "South Africa",
    "stadium": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "sourceUtc": "2026-06-18T16:00:00+00:00"
  },
  {
    "matchNumber": 26,
    "stage": "Fase de grupos",
    "date": "2026-06-18",
    "displayDate": "18/06/2026",
    "displayTime": "16:00",
    "weekday": "quinta-feira",
    "homeTeam": "Switzerland",
    "awayTeam": "Bosnia and Herzegovina",
    "stadium": "SoFi Stadium",
    "city": "Los Angeles",
    "sourceUtc": "2026-06-18T19:00:00+00:00"
  },
  {
    "matchNumber": 27,
    "stage": "Fase de grupos",
    "date": "2026-06-18",
    "displayDate": "18/06/2026",
    "displayTime": "19:00",
    "weekday": "quinta-feira",
    "homeTeam": "Canada",
    "awayTeam": "Qatar",
    "stadium": "BC Place",
    "city": "Vancouver",
    "sourceUtc": "2026-06-18T22:00:00+00:00"
  },
  {
    "matchNumber": 28,
    "stage": "Fase de grupos",
    "date": "2026-06-18",
    "displayDate": "18/06/2026",
    "displayTime": "22:00",
    "weekday": "quinta-feira",
    "homeTeam": "Mexico",
    "awayTeam": "South Korea",
    "stadium": "Estadio Akron",
    "city": "Guadalajara",
    "sourceUtc": "2026-06-19T01:00:00+00:00"
  },
  {
    "matchNumber": 29,
    "stage": "Fase de grupos",
    "date": "2026-06-19",
    "displayDate": "19/06/2026",
    "displayTime": "22:00",
    "weekday": "sexta-feira",
    "homeTeam": "Brazil",
    "awayTeam": "Haiti",
    "stadium": "Lincoln Financial Field",
    "city": "Philadelphia",
    "sourceUtc": "2026-06-20T01:00:00+00:00"
  },
  {
    "matchNumber": 30,
    "stage": "Fase de grupos",
    "date": "2026-06-19",
    "displayDate": "19/06/2026",
    "displayTime": "19:00",
    "weekday": "sexta-feira",
    "homeTeam": "Scotland",
    "awayTeam": "Morocco",
    "stadium": "Gillette Stadium",
    "city": "Boston",
    "sourceUtc": "2026-06-19T22:00:00+00:00"
  },
  {
    "matchNumber": 31,
    "stage": "Fase de grupos",
    "date": "2026-06-20",
    "displayDate": "20/06/2026",
    "displayTime": "00:00",
    "weekday": "sabado",
    "homeTeam": "Turkey",
    "awayTeam": "Paraguay",
    "stadium": "Levi's Stadium",
    "city": "San Francisco Bay Area",
    "sourceUtc": "2026-06-20T03:00:00+00:00"
  },
  {
    "matchNumber": 32,
    "stage": "Fase de grupos",
    "date": "2026-06-19",
    "displayDate": "19/06/2026",
    "displayTime": "16:00",
    "weekday": "sexta-feira",
    "homeTeam": "United States",
    "awayTeam": "Australia",
    "stadium": "Lumen Field",
    "city": "Seattle",
    "sourceUtc": "2026-06-19T19:00:00+00:00"
  },
  {
    "matchNumber": 33,
    "stage": "Fase de grupos",
    "date": "2026-06-20",
    "displayDate": "20/06/2026",
    "displayTime": "17:00",
    "weekday": "sabado",
    "homeTeam": "Germany",
    "awayTeam": "Ivory Coast",
    "stadium": "BMO Field",
    "city": "Toronto",
    "sourceUtc": "2026-06-20T20:00:00+00:00"
  },
  {
    "matchNumber": 34,
    "stage": "Fase de grupos",
    "date": "2026-06-20",
    "displayDate": "20/06/2026",
    "displayTime": "21:00",
    "weekday": "sabado",
    "homeTeam": "Ecuador",
    "awayTeam": "Curaçao",
    "stadium": "Arrowhead Stadium",
    "city": "Kansas City",
    "sourceUtc": "2026-06-21T00:00:00+00:00"
  },
  {
    "matchNumber": 35,
    "stage": "Fase de grupos",
    "date": "2026-06-20",
    "displayDate": "20/06/2026",
    "displayTime": "14:00",
    "weekday": "sabado",
    "homeTeam": "Netherlands",
    "awayTeam": "Sweden",
    "stadium": "NRG Stadium",
    "city": "Houston",
    "sourceUtc": "2026-06-20T17:00:00+00:00"
  },
  {
    "matchNumber": 36,
    "stage": "Fase de grupos",
    "date": "2026-06-21",
    "displayDate": "21/06/2026",
    "displayTime": "01:00",
    "weekday": "domingo",
    "homeTeam": "Tunisia",
    "awayTeam": "Japan",
    "stadium": "Estadio BBVA",
    "city": "Monterrey",
    "sourceUtc": "2026-06-21T04:00:00+00:00"
  },
  {
    "matchNumber": 37,
    "stage": "Fase de grupos",
    "date": "2026-06-21",
    "displayDate": "21/06/2026",
    "displayTime": "19:00",
    "weekday": "domingo",
    "homeTeam": "Uruguay",
    "awayTeam": "Cape Verde",
    "stadium": "Hard Rock Stadium",
    "city": "Miami",
    "sourceUtc": "2026-06-21T22:00:00+00:00"
  },
  {
    "matchNumber": 38,
    "stage": "Fase de grupos",
    "date": "2026-06-21",
    "displayDate": "21/06/2026",
    "displayTime": "13:00",
    "weekday": "domingo",
    "homeTeam": "Spain",
    "awayTeam": "Saudi Arabia",
    "stadium": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "sourceUtc": "2026-06-21T16:00:00+00:00"
  },
  {
    "matchNumber": 39,
    "stage": "Fase de grupos",
    "date": "2026-06-21",
    "displayDate": "21/06/2026",
    "displayTime": "16:00",
    "weekday": "domingo",
    "homeTeam": "Belgium",
    "awayTeam": "Iran",
    "stadium": "SoFi Stadium",
    "city": "Los Angeles",
    "sourceUtc": "2026-06-21T19:00:00+00:00"
  },
  {
    "matchNumber": 40,
    "stage": "Fase de grupos",
    "date": "2026-06-21",
    "displayDate": "21/06/2026",
    "displayTime": "22:00",
    "weekday": "domingo",
    "homeTeam": "New Zealand",
    "awayTeam": "Egypt",
    "stadium": "BC Place",
    "city": "Vancouver",
    "sourceUtc": "2026-06-22T01:00:00+00:00"
  },
  {
    "matchNumber": 41,
    "stage": "Fase de grupos",
    "date": "2026-06-22",
    "displayDate": "22/06/2026",
    "displayTime": "21:00",
    "weekday": "segunda-feira",
    "homeTeam": "Norway",
    "awayTeam": "Senegal",
    "stadium": "MetLife Stadium",
    "city": "New York / New Jersey",
    "sourceUtc": "2026-06-23T00:00:00+00:00"
  },
  {
    "matchNumber": 42,
    "stage": "Fase de grupos",
    "date": "2026-06-22",
    "displayDate": "22/06/2026",
    "displayTime": "18:00",
    "weekday": "segunda-feira",
    "homeTeam": "France",
    "awayTeam": "Iraq",
    "stadium": "Lincoln Financial Field",
    "city": "Philadelphia",
    "sourceUtc": "2026-06-22T21:00:00+00:00"
  },
  {
    "matchNumber": 43,
    "stage": "Fase de grupos",
    "date": "2026-06-22",
    "displayDate": "22/06/2026",
    "displayTime": "14:00",
    "weekday": "segunda-feira",
    "homeTeam": "Argentina",
    "awayTeam": "Austria",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-06-22T17:00:00+00:00"
  },
  {
    "matchNumber": 44,
    "stage": "Fase de grupos",
    "date": "2026-06-23",
    "displayDate": "23/06/2026",
    "displayTime": "00:00",
    "weekday": "terca-feira",
    "homeTeam": "Jordan",
    "awayTeam": "Algeria",
    "stadium": "Levi's Stadium",
    "city": "San Francisco Bay Area",
    "sourceUtc": "2026-06-23T03:00:00+00:00"
  },
  {
    "matchNumber": 45,
    "stage": "Fase de grupos",
    "date": "2026-06-23",
    "displayDate": "23/06/2026",
    "displayTime": "17:00",
    "weekday": "terca-feira",
    "homeTeam": "England",
    "awayTeam": "Ghana",
    "stadium": "Gillette Stadium",
    "city": "Boston",
    "sourceUtc": "2026-06-23T20:00:00+00:00"
  },
  {
    "matchNumber": 46,
    "stage": "Fase de grupos",
    "date": "2026-06-23",
    "displayDate": "23/06/2026",
    "displayTime": "20:00",
    "weekday": "terca-feira",
    "homeTeam": "Panama",
    "awayTeam": "Croatia",
    "stadium": "BMO Field",
    "city": "Toronto",
    "sourceUtc": "2026-06-23T23:00:00+00:00"
  },
  {
    "matchNumber": 47,
    "stage": "Fase de grupos",
    "date": "2026-06-23",
    "displayDate": "23/06/2026",
    "displayTime": "14:00",
    "weekday": "terca-feira",
    "homeTeam": "Portugal",
    "awayTeam": "Uzbekistan",
    "stadium": "NRG Stadium",
    "city": "Houston",
    "sourceUtc": "2026-06-23T17:00:00+00:00"
  },
  {
    "matchNumber": 48,
    "stage": "Fase de grupos",
    "date": "2026-06-23",
    "displayDate": "23/06/2026",
    "displayTime": "23:00",
    "weekday": "terca-feira",
    "homeTeam": "Colombia",
    "awayTeam": "DR Congo",
    "stadium": "Estadio Akron",
    "city": "Guadalajara",
    "sourceUtc": "2026-06-24T02:00:00+00:00"
  },
  {
    "matchNumber": 49,
    "stage": "Fase de grupos",
    "date": "2026-06-24",
    "displayDate": "24/06/2026",
    "displayTime": "19:00",
    "weekday": "quarta-feira",
    "homeTeam": "Scotland",
    "awayTeam": "Brazil",
    "stadium": "Hard Rock Stadium",
    "city": "Miami",
    "sourceUtc": "2026-06-24T22:00:00+00:00"
  },
  {
    "matchNumber": 50,
    "stage": "Fase de grupos",
    "date": "2026-06-24",
    "displayDate": "24/06/2026",
    "displayTime": "19:00",
    "weekday": "quarta-feira",
    "homeTeam": "Morocco",
    "awayTeam": "Haiti",
    "stadium": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "sourceUtc": "2026-06-24T22:00:00+00:00"
  },
  {
    "matchNumber": 51,
    "stage": "Fase de grupos",
    "date": "2026-06-24",
    "displayDate": "24/06/2026",
    "displayTime": "16:00",
    "weekday": "quarta-feira",
    "homeTeam": "Switzerland",
    "awayTeam": "Canada",
    "stadium": "BC Place",
    "city": "Vancouver",
    "sourceUtc": "2026-06-24T19:00:00+00:00"
  },
  {
    "matchNumber": 52,
    "stage": "Fase de grupos",
    "date": "2026-06-24",
    "displayDate": "24/06/2026",
    "displayTime": "16:00",
    "weekday": "quarta-feira",
    "homeTeam": "Bosnia and Herzegovina",
    "awayTeam": "Qatar",
    "stadium": "Lumen Field",
    "city": "Seattle",
    "sourceUtc": "2026-06-24T19:00:00+00:00"
  },
  {
    "matchNumber": 53,
    "stage": "Fase de grupos",
    "date": "2026-06-24",
    "displayDate": "24/06/2026",
    "displayTime": "22:00",
    "weekday": "quarta-feira",
    "homeTeam": "Czech Republic",
    "awayTeam": "Mexico",
    "stadium": "Estadio Azteca",
    "city": "Mexico City",
    "sourceUtc": "2026-06-25T01:00:00+00:00"
  },
  {
    "matchNumber": 54,
    "stage": "Fase de grupos",
    "date": "2026-06-24",
    "displayDate": "24/06/2026",
    "displayTime": "22:00",
    "weekday": "quarta-feira",
    "homeTeam": "South Africa",
    "awayTeam": "South Korea",
    "stadium": "Estadio BBVA",
    "city": "Monterrey",
    "sourceUtc": "2026-06-25T01:00:00+00:00"
  },
  {
    "matchNumber": 55,
    "stage": "Fase de grupos",
    "date": "2026-06-25",
    "displayDate": "25/06/2026",
    "displayTime": "17:00",
    "weekday": "quinta-feira",
    "homeTeam": "Curaçao",
    "awayTeam": "Ivory Coast",
    "stadium": "Lincoln Financial Field",
    "city": "Philadelphia",
    "sourceUtc": "2026-06-25T20:00:00+00:00"
  },
  {
    "matchNumber": 56,
    "stage": "Fase de grupos",
    "date": "2026-06-25",
    "displayDate": "25/06/2026",
    "displayTime": "17:00",
    "weekday": "quinta-feira",
    "homeTeam": "Ecuador",
    "awayTeam": "Germany",
    "stadium": "MetLife Stadium",
    "city": "New York / New Jersey",
    "sourceUtc": "2026-06-25T20:00:00+00:00"
  },
  {
    "matchNumber": 57,
    "stage": "Fase de grupos",
    "date": "2026-06-25",
    "displayDate": "25/06/2026",
    "displayTime": "20:00",
    "weekday": "quinta-feira",
    "homeTeam": "Japan",
    "awayTeam": "Sweden",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-06-25T23:00:00+00:00"
  },
  {
    "matchNumber": 58,
    "stage": "Fase de grupos",
    "date": "2026-06-25",
    "displayDate": "25/06/2026",
    "displayTime": "20:00",
    "weekday": "quinta-feira",
    "homeTeam": "Tunisia",
    "awayTeam": "Netherlands",
    "stadium": "Arrowhead Stadium",
    "city": "Kansas City",
    "sourceUtc": "2026-06-25T23:00:00+00:00"
  },
  {
    "matchNumber": 59,
    "stage": "Fase de grupos",
    "date": "2026-06-25",
    "displayDate": "25/06/2026",
    "displayTime": "23:00",
    "weekday": "quinta-feira",
    "homeTeam": "Turkey",
    "awayTeam": "United States",
    "stadium": "SoFi Stadium",
    "city": "Los Angeles",
    "sourceUtc": "2026-06-26T02:00:00+00:00"
  },
  {
    "matchNumber": 60,
    "stage": "Fase de grupos",
    "date": "2026-06-25",
    "displayDate": "25/06/2026",
    "displayTime": "23:00",
    "weekday": "quinta-feira",
    "homeTeam": "Paraguay",
    "awayTeam": "Australia",
    "stadium": "Levi's Stadium",
    "city": "San Francisco Bay Area",
    "sourceUtc": "2026-06-26T02:00:00+00:00"
  },
  {
    "matchNumber": 61,
    "stage": "Fase de grupos",
    "date": "2026-06-26",
    "displayDate": "26/06/2026",
    "displayTime": "16:00",
    "weekday": "sexta-feira",
    "homeTeam": "Norway",
    "awayTeam": "France",
    "stadium": "Gillette Stadium",
    "city": "Boston",
    "sourceUtc": "2026-06-26T19:00:00+00:00"
  },
  {
    "matchNumber": 62,
    "stage": "Fase de grupos",
    "date": "2026-06-26",
    "displayDate": "26/06/2026",
    "displayTime": "16:00",
    "weekday": "sexta-feira",
    "homeTeam": "Senegal",
    "awayTeam": "Iraq",
    "stadium": "BMO Field",
    "city": "Toronto",
    "sourceUtc": "2026-06-26T19:00:00+00:00"
  },
  {
    "matchNumber": 63,
    "stage": "Fase de grupos",
    "date": "2026-06-27",
    "displayDate": "27/06/2026",
    "displayTime": "00:00",
    "weekday": "sabado",
    "homeTeam": "Egypt",
    "awayTeam": "Iran",
    "stadium": "Lumen Field",
    "city": "Seattle",
    "sourceUtc": "2026-06-27T03:00:00+00:00"
  },
  {
    "matchNumber": 64,
    "stage": "Fase de grupos",
    "date": "2026-06-27",
    "displayDate": "27/06/2026",
    "displayTime": "00:00",
    "weekday": "sabado",
    "homeTeam": "New Zealand",
    "awayTeam": "Belgium",
    "stadium": "BC Place",
    "city": "Vancouver",
    "sourceUtc": "2026-06-27T03:00:00+00:00"
  },
  {
    "matchNumber": 65,
    "stage": "Fase de grupos",
    "date": "2026-06-26",
    "displayDate": "26/06/2026",
    "displayTime": "21:00",
    "weekday": "sexta-feira",
    "homeTeam": "Cape Verde",
    "awayTeam": "Saudi Arabia",
    "stadium": "NRG Stadium",
    "city": "Houston",
    "sourceUtc": "2026-06-27T00:00:00+00:00"
  },
  {
    "matchNumber": 66,
    "stage": "Fase de grupos",
    "date": "2026-06-26",
    "displayDate": "26/06/2026",
    "displayTime": "21:00",
    "weekday": "sexta-feira",
    "homeTeam": "Uruguay",
    "awayTeam": "Spain",
    "stadium": "Estadio Akron",
    "city": "Guadalajara",
    "sourceUtc": "2026-06-27T00:00:00+00:00"
  },
  {
    "matchNumber": 67,
    "stage": "Fase de grupos",
    "date": "2026-06-27",
    "displayDate": "27/06/2026",
    "displayTime": "18:00",
    "weekday": "sabado",
    "homeTeam": "Panama",
    "awayTeam": "England",
    "stadium": "MetLife Stadium",
    "city": "New York / New Jersey",
    "sourceUtc": "2026-06-27T21:00:00+00:00"
  },
  {
    "matchNumber": 68,
    "stage": "Fase de grupos",
    "date": "2026-06-27",
    "displayDate": "27/06/2026",
    "displayTime": "18:00",
    "weekday": "sabado",
    "homeTeam": "Croatia",
    "awayTeam": "Ghana",
    "stadium": "Lincoln Financial Field",
    "city": "Philadelphia",
    "sourceUtc": "2026-06-27T21:00:00+00:00"
  },
  {
    "matchNumber": 69,
    "stage": "Fase de grupos",
    "date": "2026-06-27",
    "displayDate": "27/06/2026",
    "displayTime": "23:00",
    "weekday": "sabado",
    "homeTeam": "Algeria",
    "awayTeam": "Austria",
    "stadium": "Arrowhead Stadium",
    "city": "Kansas City",
    "sourceUtc": "2026-06-28T02:00:00+00:00"
  },
  {
    "matchNumber": 70,
    "stage": "Fase de grupos",
    "date": "2026-06-27",
    "displayDate": "27/06/2026",
    "displayTime": "23:00",
    "weekday": "sabado",
    "homeTeam": "Jordan",
    "awayTeam": "Argentina",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-06-28T02:00:00+00:00"
  },
  {
    "matchNumber": 71,
    "stage": "Fase de grupos",
    "date": "2026-06-27",
    "displayDate": "27/06/2026",
    "displayTime": "20:30",
    "weekday": "sabado",
    "homeTeam": "Colombia",
    "awayTeam": "Portugal",
    "stadium": "Hard Rock Stadium",
    "city": "Miami",
    "sourceUtc": "2026-06-27T23:30:00+00:00"
  },
  {
    "matchNumber": 72,
    "stage": "Fase de grupos",
    "date": "2026-06-27",
    "displayDate": "27/06/2026",
    "displayTime": "20:30",
    "weekday": "sabado",
    "homeTeam": "DR Congo",
    "awayTeam": "Uzbekistan",
    "stadium": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "sourceUtc": "2026-06-27T23:30:00+00:00"
  },
  {
    "matchNumber": 73,
    "stage": "Fase de 32",
    "date": "2026-06-28",
    "displayDate": "28/06/2026",
    "displayTime": "16:00",
    "weekday": "domingo",
    "homeTeam": "Group A runners-up",
    "awayTeam": "Group B runners-up",
    "stadium": "SoFi Stadium",
    "city": "Los Angeles",
    "sourceUtc": "2026-06-28T19:00:00+00:00"
  },
  {
    "matchNumber": 74,
    "stage": "Fase de 32",
    "date": "2026-06-29",
    "displayDate": "29/06/2026",
    "displayTime": "17:30",
    "weekday": "segunda-feira",
    "homeTeam": "Group E winners",
    "awayTeam": "Group A/B/C/D/F third place",
    "stadium": "Gillette Stadium",
    "city": "Boston",
    "sourceUtc": "2026-06-29T20:30:00+00:00"
  },
  {
    "matchNumber": 75,
    "stage": "Fase de 32",
    "date": "2026-06-29",
    "displayDate": "29/06/2026",
    "displayTime": "22:00",
    "weekday": "segunda-feira",
    "homeTeam": "Group F winners",
    "awayTeam": "Group C runners-up",
    "stadium": "Estadio BBVA",
    "city": "Monterrey",
    "sourceUtc": "2026-06-30T01:00:00+00:00"
  },
  {
    "matchNumber": 76,
    "stage": "Fase de 32",
    "date": "2026-06-29",
    "displayDate": "29/06/2026",
    "displayTime": "14:00",
    "weekday": "segunda-feira",
    "homeTeam": "Group C winners",
    "awayTeam": "Group F runners-up",
    "stadium": "NRG Stadium",
    "city": "Houston",
    "sourceUtc": "2026-06-29T17:00:00+00:00"
  },
  {
    "matchNumber": 77,
    "stage": "Fase de 32",
    "date": "2026-06-30",
    "displayDate": "30/06/2026",
    "displayTime": "18:00",
    "weekday": "terca-feira",
    "homeTeam": "Group I winners",
    "awayTeam": "Group C/D/F/G/H third place",
    "stadium": "MetLife Stadium",
    "city": "New York / New Jersey",
    "sourceUtc": "2026-06-30T21:00:00+00:00"
  },
  {
    "matchNumber": 78,
    "stage": "Fase de 32",
    "date": "2026-06-30",
    "displayDate": "30/06/2026",
    "displayTime": "14:00",
    "weekday": "terca-feira",
    "homeTeam": "Group E runners-up",
    "awayTeam": "Group I runners-up",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-06-30T17:00:00+00:00"
  },
  {
    "matchNumber": 79,
    "stage": "Fase de 32",
    "date": "2026-06-30",
    "displayDate": "30/06/2026",
    "displayTime": "22:00",
    "weekday": "terca-feira",
    "homeTeam": "Group A winners",
    "awayTeam": "Group C/E/F/H/I third place",
    "stadium": "Estadio Azteca",
    "city": "Mexico City",
    "sourceUtc": "2026-07-01T01:00:00+00:00"
  },
  {
    "matchNumber": 80,
    "stage": "Fase de 32",
    "date": "2026-07-01",
    "displayDate": "01/07/2026",
    "displayTime": "13:00",
    "weekday": "quarta-feira",
    "homeTeam": "Group L winners",
    "awayTeam": "Group E/H/I/J/K third place",
    "stadium": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "sourceUtc": "2026-07-01T16:00:00+00:00"
  },
  {
    "matchNumber": 81,
    "stage": "Fase de 32",
    "date": "2026-07-01",
    "displayDate": "01/07/2026",
    "displayTime": "21:00",
    "weekday": "quarta-feira",
    "homeTeam": "Group D winners",
    "awayTeam": "Group B/E/F/I/J third place",
    "stadium": "Levi's Stadium",
    "city": "San Francisco Bay Area",
    "sourceUtc": "2026-07-02T00:00:00+00:00"
  },
  {
    "matchNumber": 82,
    "stage": "Fase de 32",
    "date": "2026-07-01",
    "displayDate": "01/07/2026",
    "displayTime": "17:00",
    "weekday": "quarta-feira",
    "homeTeam": "Group G winners",
    "awayTeam": "Group A/E/H/I/J third place",
    "stadium": "Lumen Field",
    "city": "Seattle",
    "sourceUtc": "2026-07-01T20:00:00+00:00"
  },
  {
    "matchNumber": 83,
    "stage": "Fase de 32",
    "date": "2026-07-02",
    "displayDate": "02/07/2026",
    "displayTime": "20:00",
    "weekday": "quinta-feira",
    "homeTeam": "Group K runners-up",
    "awayTeam": "Group L runners-up",
    "stadium": "BMO Field",
    "city": "Toronto",
    "sourceUtc": "2026-07-02T23:00:00+00:00"
  },
  {
    "matchNumber": 84,
    "stage": "Fase de 32",
    "date": "2026-07-02",
    "displayDate": "02/07/2026",
    "displayTime": "16:00",
    "weekday": "quinta-feira",
    "homeTeam": "Group H winners",
    "awayTeam": "Group J runners-up",
    "stadium": "SoFi Stadium",
    "city": "Los Angeles",
    "sourceUtc": "2026-07-02T19:00:00+00:00"
  },
  {
    "matchNumber": 85,
    "stage": "Fase de 32",
    "date": "2026-07-03",
    "displayDate": "03/07/2026",
    "displayTime": "00:00",
    "weekday": "sexta-feira",
    "homeTeam": "Group B winners",
    "awayTeam": "Group E/F/G/I/J third place",
    "stadium": "BC Place",
    "city": "Vancouver",
    "sourceUtc": "2026-07-03T03:00:00+00:00"
  },
  {
    "matchNumber": 86,
    "stage": "Fase de 32",
    "date": "2026-07-03",
    "displayDate": "03/07/2026",
    "displayTime": "19:00",
    "weekday": "sexta-feira",
    "homeTeam": "Group J winners",
    "awayTeam": "Group H runners-up",
    "stadium": "Hard Rock Stadium",
    "city": "Miami",
    "sourceUtc": "2026-07-03T22:00:00+00:00"
  },
  {
    "matchNumber": 87,
    "stage": "Fase de 32",
    "date": "2026-07-03",
    "displayDate": "03/07/2026",
    "displayTime": "22:30",
    "weekday": "sexta-feira",
    "homeTeam": "Group K winners",
    "awayTeam": "Group D/E/I/J/L third place",
    "stadium": "Arrowhead Stadium",
    "city": "Kansas City",
    "sourceUtc": "2026-07-04T01:30:00+00:00"
  },
  {
    "matchNumber": 88,
    "stage": "Fase de 32",
    "date": "2026-07-03",
    "displayDate": "03/07/2026",
    "displayTime": "15:00",
    "weekday": "sexta-feira",
    "homeTeam": "Group D runners-up",
    "awayTeam": "Group G runners-up",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-07-03T18:00:00+00:00"
  },
  {
    "matchNumber": 89,
    "stage": "Oitavas de final",
    "date": "2026-07-04",
    "displayDate": "04/07/2026",
    "displayTime": "18:00",
    "weekday": "sabado",
    "homeTeam": "Winner Match 74",
    "awayTeam": "Winner Match 77",
    "stadium": "Lincoln Financial Field",
    "city": "Philadelphia",
    "sourceUtc": "2026-07-04T21:00:00+00:00"
  },
  {
    "matchNumber": 90,
    "stage": "Oitavas de final",
    "date": "2026-07-04",
    "displayDate": "04/07/2026",
    "displayTime": "14:00",
    "weekday": "sabado",
    "homeTeam": "Winner Match 73",
    "awayTeam": "Winner Match 75",
    "stadium": "NRG Stadium",
    "city": "Houston",
    "sourceUtc": "2026-07-04T17:00:00+00:00"
  },
  {
    "matchNumber": 91,
    "stage": "Oitavas de final",
    "date": "2026-07-05",
    "displayDate": "05/07/2026",
    "displayTime": "17:00",
    "weekday": "domingo",
    "homeTeam": "Winner Match 76",
    "awayTeam": "Winner Match 78",
    "stadium": "MetLife Stadium",
    "city": "New York / New Jersey",
    "sourceUtc": "2026-07-05T20:00:00+00:00"
  },
  {
    "matchNumber": 92,
    "stage": "Oitavas de final",
    "date": "2026-07-05",
    "displayDate": "05/07/2026",
    "displayTime": "21:00",
    "weekday": "domingo",
    "homeTeam": "Winner Match 79",
    "awayTeam": "Winner Match 80",
    "stadium": "Estadio Azteca",
    "city": "Mexico City",
    "sourceUtc": "2026-07-06T00:00:00+00:00"
  },
  {
    "matchNumber": 93,
    "stage": "Oitavas de final",
    "date": "2026-07-06",
    "displayDate": "06/07/2026",
    "displayTime": "16:00",
    "weekday": "segunda-feira",
    "homeTeam": "Winner Match 83",
    "awayTeam": "Winner Match 84",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-07-06T19:00:00+00:00"
  },
  {
    "matchNumber": 94,
    "stage": "Oitavas de final",
    "date": "2026-07-06",
    "displayDate": "06/07/2026",
    "displayTime": "21:00",
    "weekday": "segunda-feira",
    "homeTeam": "Winner Match 81",
    "awayTeam": "Winner Match 82",
    "stadium": "Lumen Field",
    "city": "Seattle",
    "sourceUtc": "2026-07-07T00:00:00+00:00"
  },
  {
    "matchNumber": 95,
    "stage": "Oitavas de final",
    "date": "2026-07-07",
    "displayDate": "07/07/2026",
    "displayTime": "13:00",
    "weekday": "terca-feira",
    "homeTeam": "Winner Match 86",
    "awayTeam": "Winner Match 88",
    "stadium": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "sourceUtc": "2026-07-07T16:00:00+00:00"
  },
  {
    "matchNumber": 96,
    "stage": "Oitavas de final",
    "date": "2026-07-07",
    "displayDate": "07/07/2026",
    "displayTime": "17:00",
    "weekday": "terca-feira",
    "homeTeam": "Winner Match 85",
    "awayTeam": "Winner Match 87",
    "stadium": "BC Place",
    "city": "Vancouver",
    "sourceUtc": "2026-07-07T20:00:00+00:00"
  },
  {
    "matchNumber": 97,
    "stage": "Quartas de final",
    "date": "2026-07-09",
    "displayDate": "09/07/2026",
    "displayTime": "17:00",
    "weekday": "quinta-feira",
    "homeTeam": "Winner Match 89",
    "awayTeam": "Winner Match 90",
    "stadium": "Gillette Stadium",
    "city": "Boston",
    "sourceUtc": "2026-07-09T20:00:00+00:00"
  },
  {
    "matchNumber": 98,
    "stage": "Quartas de final",
    "date": "2026-07-10",
    "displayDate": "10/07/2026",
    "displayTime": "16:00",
    "weekday": "sexta-feira",
    "homeTeam": "Winner Match 93",
    "awayTeam": "Winner Match 94",
    "stadium": "SoFi Stadium",
    "city": "Los Angeles",
    "sourceUtc": "2026-07-10T19:00:00+00:00"
  },
  {
    "matchNumber": 99,
    "stage": "Quartas de final",
    "date": "2026-07-11",
    "displayDate": "11/07/2026",
    "displayTime": "18:00",
    "weekday": "sabado",
    "homeTeam": "Winner Match 91",
    "awayTeam": "Winner Match 92",
    "stadium": "Hard Rock Stadium",
    "city": "Miami",
    "sourceUtc": "2026-07-11T21:00:00+00:00"
  },
  {
    "matchNumber": 100,
    "stage": "Quartas de final",
    "date": "2026-07-11",
    "displayDate": "11/07/2026",
    "displayTime": "22:00",
    "weekday": "sabado",
    "homeTeam": "Winner Match 95",
    "awayTeam": "Winner Match 96",
    "stadium": "Arrowhead Stadium",
    "city": "Kansas City",
    "sourceUtc": "2026-07-12T01:00:00+00:00"
  },
  {
    "matchNumber": 101,
    "stage": "Semifinal",
    "date": "2026-07-14",
    "displayDate": "14/07/2026",
    "displayTime": "16:00",
    "weekday": "terca-feira",
    "homeTeam": "Winner Match 97",
    "awayTeam": "Winner Match 98",
    "stadium": "AT&T Stadium",
    "city": "Dallas",
    "sourceUtc": "2026-07-14T19:00:00+00:00"
  },
  {
    "matchNumber": 102,
    "stage": "Semifinal",
    "date": "2026-07-15",
    "displayDate": "15/07/2026",
    "displayTime": "16:00",
    "weekday": "quarta-feira",
    "homeTeam": "Winner Match 99",
    "awayTeam": "Winner Match 100",
    "stadium": "Mercedes-Benz Stadium",
    "city": "Atlanta",
    "sourceUtc": "2026-07-15T19:00:00+00:00"
  },
  {
    "matchNumber": 103,
    "stage": "Disputa do 3o lugar",
    "date": "2026-07-18",
    "displayDate": "18/07/2026",
    "displayTime": "18:00",
    "weekday": "sabado",
    "homeTeam": "Loser Match 101",
    "awayTeam": "Loser Match 102",
    "stadium": "Hard Rock Stadium",
    "city": "Miami",
    "sourceUtc": "2026-07-18T21:00:00+00:00"
  },
  {
    "matchNumber": 104,
    "stage": "Final",
    "date": "2026-07-19",
    "displayDate": "19/07/2026",
    "displayTime": "16:00",
    "weekday": "domingo",
    "homeTeam": "Winner Match 101",
    "awayTeam": "Winner Match 102",
    "stadium": "MetLife Stadium",
    "city": "New York / New Jersey",
    "sourceUtc": "2026-07-19T19:00:00+00:00"
  }
];
let fullScheduleData = loadScheduleMemory();

const worldCupMatches = [
  {
    id: "bra-mar",
    round: "1a rodada",
    date: "2026-06-13",
    displayDate: "13 Jun 2026",
    weekday: "Sabado",
    time: "19:00",
    venue: "New York New Jersey Stadium",
    homeTeam: "Brasil",
    awayTeam: "Marrocos",
    homeFlag: "BR",
    awayFlag: "MA"
  },
  {
    id: "bra-hai",
    round: "2a rodada",
    date: "2026-06-19",
    displayDate: "19 Jun 2026",
    weekday: "Sexta",
    time: "21:30",
    venue: "Philadelphia Stadium",
    homeTeam: "Brasil",
    awayTeam: "Haiti",
    homeFlag: "BR",
    awayFlag: "HT"
  },
  {
    id: "sco-bra",
    round: "3a rodada",
    date: "2026-06-24",
    displayDate: "24 Jun 2026",
    weekday: "Quarta",
    time: "19:00",
    venue: "Miami Stadium",
    homeTeam: "Escocia",
    awayTeam: "Brasil",
    homeFlag: "SC",
    awayFlag: "BR"
  }
];

officialResults = defaultResults();

function scheduleGroupList(groups = "") {
  return groups.split("/").join(", ");
}

function translateScheduleStage(stage = "") {
  const labels = {
    "Fase de grupos": "Fase de grupos",
    "Fase de 32": "Primeira fase eliminatoria",
    "Oitavas de final": "Oitavas de final",
    "Quartas de final": "Quartas de final",
    Semifinal: "Semifinal",
    "Disputa do 3o lugar": "Disputa de terceiro lugar",
    Final: "Final"
  };
  return labels[stage] || stage;
}

function translateScheduleTeam(label = "") {
  const teamNames = {
    Mexico: "Mexico",
    "South Africa": "Africa do Sul",
    "South Korea": "Coreia do Sul",
    "Czech Republic": "Republica Tcheca",
    Canada: "Canada",
    "Bosnia and Herzegovina": "Bosnia e Herzegovina",
    "United States": "Estados Unidos",
    Paraguay: "Paraguai",
    Haiti: "Haiti",
    Scotland: "Escocia",
    Australia: "Australia",
    Turkey: "Turquia",
    Brazil: "Brasil",
    Morocco: "Marrocos",
    Qatar: "Catar",
    Switzerland: "Suica",
    "Ivory Coast": "Costa do Marfim",
    Ecuador: "Equador",
    Germany: "Alemanha",
    "Curaçao": "Curacao",
    Netherlands: "Holanda",
    Japan: "Japao",
    Sweden: "Suecia",
    Tunisia: "Tunisia",
    "Saudi Arabia": "Arabia Saudita",
    Uruguay: "Uruguai",
    Spain: "Espanha",
    "Cape Verde": "Cabo Verde",
    Iran: "Ira",
    "New Zealand": "Nova Zelandia",
    Belgium: "Belgica",
    Egypt: "Egito",
    France: "Franca",
    Senegal: "Senegal",
    Iraq: "Iraque",
    Norway: "Noruega",
    Argentina: "Argentina",
    Algeria: "Argelia",
    Austria: "Austria",
    Jordan: "Jordania",
    Ghana: "Gana",
    Panama: "Panama",
    England: "Inglaterra",
    Croatia: "Croacia",
    Portugal: "Portugal",
    "DR Congo": "Republica Democratica do Congo",
    Uzbekistan: "Uzbequistao",
    Colombia: "Colombia"
  };

  const direct = teamNames[label];
  if (direct) {
    return direct;
  }

  let match = label.match(/^Winner Match (\d+)$/);
  if (match) {
    return `Vencedor do Jogo ${match[1]}`;
  }

  match = label.match(/^Loser Match (\d+)$/);
  if (match) {
    return `Perdedor do Jogo ${match[1]}`;
  }

  match = label.match(/^Group ([A-L]) winners$/);
  if (match) {
    return `1o colocado do Grupo ${match[1]}`;
  }

  match = label.match(/^Group ([A-L]) runners-up$/);
  if (match) {
    return `2o colocado do Grupo ${match[1]}`;
  }

  match = label.match(/^Group ([A-L](?:\/[A-L])+) third place$/);
  if (match) {
    return `melhor 3o colocado entre os Grupos ${scheduleGroupList(match[1])}`;
  }

  return label;
}

function translateScheduleCity(city = "") {
  const cities = {
    "Mexico City": "Cidade do Mexico",
    Guadalajara: "Guadalajara",
    Toronto: "Toronto",
    "Los Angeles": "Los Angeles",
    Boston: "Boston",
    Vancouver: "Vancouver",
    "New York / New Jersey": "Nova York / Nova Jersey",
    "San Francisco Bay Area": "Baia de San Francisco",
    Philadelphia: "Filadelfia",
    Houston: "Houston",
    Dallas: "Dallas",
    Monterrey: "Monterrey",
    Miami: "Miami",
    Seattle: "Seattle",
    Atlanta: "Atlanta",
    "Kansas City": "Kansas City"
  };
  return cities[city] || city;
}

function localizeScheduleMatch(match) {
  return {
    ...match,
    stage: translateScheduleStage(match.stage),
    homeTeam: translateScheduleTeam(match.homeTeam),
    awayTeam: translateScheduleTeam(match.awayTeam),
    city: translateScheduleCity(match.city)
  };
}

function localizedScheduleData() {
  return fullScheduleData.map(localizeScheduleMatch);
}

function loadScheduleMemory() {
  const savedVersion = localStorage.getItem(scheduleVersionKey);
  const savedSchedule = readStorage(scheduleKey);

  if (savedVersion === scheduleVersion && Array.isArray(savedSchedule) && savedSchedule.length) {
    const localizedSavedSchedule = savedSchedule.map(localizeScheduleMatch);
    saveStorage(scheduleKey, localizedSavedSchedule);
    return localizedSavedSchedule;
  }

  const localizedSchedule = fullScheduleSeed.map(localizeScheduleMatch);
  saveStorage(scheduleKey, localizedSchedule);
  localStorage.setItem(scheduleVersionKey, scheduleVersion);
  return localizedSchedule;
}

function isAdmin() {
  return accessMode === "admin";
}

function applyAccessMode() {
  document.body.classList.toggle("is-locked", !accessMode);
  document.body.classList.toggle("is-admin", isAdmin());
  loginScreen.hidden = Boolean(accessMode);
  logoutButton.textContent = isAdmin() ? "Sair do admin" : "Trocar acesso";
}

function setAccessMode(mode) {
  accessMode = mode;
  localStorage.setItem(accessKey, mode);
  applyAccessMode();
  renderMatches();
  renderPool();
  renderGallery();
  renderQuotas();
  renderExpenses();
}

function toggleFullScheduleModal(show) {
  fullScheduleModal.hidden = !show;
  document.body.classList.toggle("is-locked", show || !accessMode);
  if (show) {
    renderFullSchedule();
  }
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function defaultResults() {
  return Object.fromEntries(worldCupMatches.map((match) => [match.id, { homeScore: "", awayScore: "" }]));
}

function normalizeName(value = "") {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function flagEmoji(code = "") {
  const flags = {
    BR: "🇧🇷",
    MA: "🇲🇦",
    HT: "🇭🇹",
    SC: "🏴"
  };
  return flags[code] || code;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };
    return entities[char] || char;
  });
}

function scheduleFilterValue() {
  return fullScheduleStageFilter.value || "all";
}

function scheduleSearchValue() {
  return normalizeName(fullScheduleSearch.value || "");
}

function filteredScheduleMatches() {
  const stage = scheduleFilterValue();
  const search = scheduleSearchValue();
  const matches = localizedScheduleData();

  return matches.filter((match) => {
    const stageMatches = stage === "all" || match.stage === stage;
    if (!stageMatches) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = normalizeName(
      [
        match.stage,
        match.homeTeam,
        match.awayTeam,
        match.stadium,
        match.city,
        match.displayDate,
        `jogo ${match.matchNumber}`
      ].join(" ")
    );
    return haystack.includes(search);
  });
}

function populateScheduleStageFilter() {
  const stages = [...new Set(localizedScheduleData().map((match) => match.stage))];
  fullScheduleStageFilter.innerHTML = [
    '<option value="all">Todas as fases</option>',
    ...stages.map((stage) => `<option value="${escapeHtml(stage)}">${escapeHtml(stage)}</option>`)
  ].join("");
}

function renderFullSchedule() {
  const matches = filteredScheduleMatches();
  const stadiums = new Set(matches.map((match) => `${match.stadium}|${match.city}`));

  fullScheduleCount.textContent = String(matches.length);
  fullScheduleVenueCount.textContent = String(stadiums.size);

  if (!matches.length) {
    fullScheduleRows.innerHTML = `
      <tr>
        <td colspan="6">Nenhum jogo encontrado para esse filtro.</td>
      </tr>
    `;
    return;
  }

  fullScheduleRows.innerHTML = matches
    .map(
      (match) => `
        <tr>
          <td data-label="Jogo"><strong>#${match.matchNumber}</strong></td>
          <td data-label="Fase">${escapeHtml(match.stage)}</td>
          <td data-label="Data">${escapeHtml(match.displayDate)}</td>
          <td data-label="Hora">${escapeHtml(match.displayTime)}</td>
          <td data-label="Confronto">${escapeHtml(match.homeTeam)} x ${escapeHtml(match.awayTeam)}</td>
          <td data-label="Estadio">${escapeHtml(match.stadium)}<br><small>${escapeHtml(match.city)}</small></td>
        </tr>
      `
    )
    .join("");
}

function getResultValue(matchId, side) {
  const result = officialResults[matchId];
  if (!result) {
    return "";
  }
  return result[side];
}

function hasOfficialResult(matchId) {
  const home = getResultValue(matchId, "homeScore");
  const away = getResultValue(matchId, "awayScore");
  return home !== "" && away !== "";
}

function outcomeLabel(homeScore, awayScore) {
  if (homeScore === awayScore) {
    return "draw";
  }
  return homeScore > awayScore ? "home" : "away";
}

function mediaUrl(item) {
  return item.media_url || item.dataUrl || item.externalUrl;
}

function mediaType(item) {
  return item.media_type || item.type || guessMediaType(mediaUrl(item));
}

function guessMediaType(url = "") {
  const cleanUrl = url.split("?")[0].toLowerCase();
  if (isYoutubeUrl(url) || cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm") || cleanUrl.endsWith(".mov")) {
    return "video/link";
  }
  return "image/link";
}

function isYoutubeUrl(url = "") {
  return url.includes("youtube.com/watch") || url.includes("youtu.be/");
}

function youtubeEmbedUrl(url = "") {
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes("youtu.be")
      ? parsed.pathname.replace("/", "")
      : parsed.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function isDirectMediaUrl(url = "") {
  const cleanUrl = url.split("?")[0].toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)$/.test(cleanUrl);
}

function createMediaElement(item) {
  const url = mediaUrl(item);

  if (isYoutubeUrl(url)) {
    const iframe = document.createElement("iframe");
    iframe.src = youtubeEmbedUrl(url);
    iframe.title = item.caption;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    return iframe;
  }

  if (!item.dataUrl && !isDirectMediaUrl(url)) {
    const link = document.createElement("a");
    link.className = "media-link-preview";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Abrir midia";
    return link;
  }

  const media = document.createElement(mediaType(item).startsWith("video") ? "video" : "img");
  media.src = url;
  media.alt = item.caption;
  if (media.tagName === "VIDEO") {
    media.controls = true;
  }
  return media;
}

function showMessage(message, isError = false) {
  connectionStatus.textContent = message;
  connectionStatus.classList.toggle("error", isError);
}

async function loadData() {
  if (!hasSupabase) {
    if (hasJsonBlob) {
      try {
        const response = await fetch(config.jsonBlobUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Falha ao carregar JSONBlob");
        }
        const data = await response.json();
        gallery = data.gallery || [];
        quotas = data.quotas || [];
        expenses = data.expenses || [];
        bets = data.bets || [];
        officialResults = { ...defaultResults(), ...(data.officialResults || {}) };
        showMessage("Dados salvos em banco persistente compartilhado.");
      } catch {
        gallery = readStorage(galleryKey);
        quotas = readStorage(quotaKey);
        expenses = readStorage(expenseKey);
        bets = readStorage(betKey);
        officialResults = { ...defaultResults(), ...(readStorage(resultKey) || {}) };
        showMessage("Nao foi possivel carregar o banco. Usando modo local neste navegador.", true);
      }
      renderMatches();
      renderPool();
      renderGallery();
      renderQuotas();
      renderExpenses();
      return;
    }

    gallery = readStorage(galleryKey);
    quotas = readStorage(quotaKey);
    expenses = readStorage(expenseKey);
    bets = readStorage(betKey);
    officialResults = { ...defaultResults(), ...(readStorage(resultKey) || {}) };
    showMessage("Modo local: configure o Supabase para salvar os dados na web.");
    renderMatches();
    renderPool();
    renderGallery();
    renderQuotas();
    renderExpenses();
    return;
  }

  showMessage("Conectado ao banco de dados. Carregando informacoes...");
  const [
    { data: galleryData, error: galleryError },
    { data: quotaData, error: quotaError },
    { data: expenseData, error: expenseError }
  ] = await Promise.all([
    db.from("gallery_items").select("*").order("created_at", { ascending: false }),
    db.from("quotas").select("*").order("created_at", { ascending: false }),
    db.from("expenses").select("*").order("expense_date", { ascending: false }).order("created_at", { ascending: false })
  ]);

  if (galleryError || quotaError || expenseError) {
    showMessage("Nao foi possivel carregar o banco. Confira a configuracao do Supabase.", true);
    return;
  }

  gallery = galleryData || [];
  quotas = quotaData || [];
  expenses = expenseData || [];
  bets = readStorage(betKey);
  officialResults = { ...defaultResults(), ...(readStorage(resultKey) || {}) };
  showMessage("Dados salvos em banco persistente.");
  renderMatches();
  renderPool();
  renderGallery();
  renderQuotas();
  renderExpenses();
}

async function saveJsonBlob() {
  if (!hasJsonBlob) {
    return;
  }

  const response = await fetch(config.jsonBlobUrl, {
    method: config.jsonBlobUrl.includes("mantledb.sh") ? "POST" : "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ gallery, quotas, expenses, bets, officialResults })
  });

  if (!response.ok) {
    throw new Error("Falha ao salvar JSONBlob");
  }
}

function canStoreFileInJson(file) {
  if (!hasJsonBlob || hasSupabase || hasCloudinary) {
    return true;
  }

  const maxBytes = 700 * 1024;
  return file.size <= maxBytes;
}

function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Nao foi possivel ler a duracao do video"));
    };
    video.src = objectUrl;
  });
}

async function validateMediaFile(file) {
  if (!file.type.startsWith("video")) {
    return true;
  }

  try {
    const duration = await getVideoDuration(file);
    if (duration > maxVideoSeconds + 0.5) {
      showMessage(`O video tem ${Math.ceil(duration)} segundos. O limite e ${maxVideoSeconds} segundos.`, true);
      return false;
    }
    return true;
  } catch {
    showMessage("Nao foi possivel verificar a duracao do video. Tente outro arquivo.", true);
    return false;
  }
}

async function uploadToCloudinary(file, item) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", config.cloudinaryUploadPreset);
  formData.append("folder", "rua-do-brasil");
  formData.append("public_id", `${item.year}-${item.id}`);

  const resourceType = file.type.startsWith("video") ? "video" : "image";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error("Falha ao enviar para o Cloudinary");
  }

  return response.json();
}

function renderYearFilter() {
  const selected = yearFilter.value;
  const years = [...new Set(gallery.map((item) => item.year))].sort((a, b) => b - a);

  yearFilter.innerHTML = '<option value="todos">Todos os anos</option>';
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.append(option);
  });

  yearFilter.value = years.includes(Number(selected)) ? selected : "todos";
}

function renderMatches() {
  matchGrid.innerHTML = "";

  worldCupMatches.forEach((match) => {
    const card = document.createElement("article");
    card.className = "match-card";
    card.innerHTML = `
      <div class="match-card-top">
        <span class="match-round">${match.round}</span>
        <span class="match-date">${match.weekday}, ${match.displayDate}</span>
      </div>
      <div class="match-teams">
        <div class="match-team">
          <span class="team-badge">${flagEmoji(match.homeFlag)}</span>
          <span class="team-name">${match.homeTeam}</span>
        </div>
        <div class="match-versus">vs</div>
        <div class="match-team">
          <span class="team-badge">${flagEmoji(match.awayFlag)}</span>
          <span class="team-name">${match.awayTeam}</span>
        </div>
      </div>
      <div class="match-meta">
        <span>${match.time} - horario de Brasilia</span>
        <span>${match.venue}</span>
      </div>
    `;
    matchGrid.append(card);
  });
}

function scorePrediction(prediction, matchId) {
  const result = officialResults[matchId];
  if (!prediction || !result || result.homeScore === "" || result.awayScore === "") {
    return { points: 0, exact: 0 };
  }

  const predictedHome = Number(prediction.homeScore);
  const predictedAway = Number(prediction.awayScore);
  const officialHome = Number(result.homeScore);
  const officialAway = Number(result.awayScore);

  if (predictedHome === officialHome && predictedAway === officialAway) {
    return { points: 6, exact: 1 };
  }

  if (outcomeLabel(predictedHome, predictedAway) === outcomeLabel(officialHome, officialAway)) {
    return { points: 3, exact: 0 };
  }

  return { points: 0, exact: 0 };
}

function buildRanking() {
  return bets
    .map((bet) => {
      const totals = worldCupMatches.reduce((accumulator, match) => {
        const prediction = bet.predictions.find((item) => item.matchId === match.id);
        const score = scorePrediction(prediction, match.id);
        return {
          points: accumulator.points + score.points,
          exactHits: accumulator.exactHits + score.exact
        };
      }, { points: 0, exactHits: 0 });

      return {
        ...bet,
        ...totals
      };
    })
    .sort((left, right) => (
      right.points - left.points ||
      right.exactHits - left.exactHits ||
      left.name.localeCompare(right.name, "pt-BR")
    ));
}

function buildExpenseCategoryTotals() {
  return expenses.reduce((accumulator, item) => {
    const key = item.category || "Outros";
    accumulator[key] = (accumulator[key] || 0) + Number(item.value || 0);
    return accumulator;
  }, {});
}

function formatRelativeCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) {
    return "Hoje e dia de jogo";
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (days > 0) {
    return `${days}d ${hours}h para a bola rolar`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}min para a bola rolar`;
  }
  return `${minutes}min para a bola rolar`;
}

function updateNextMatchCountdown() {
  const now = new Date();
  const upcoming = worldCupMatches
    .map((match) => {
      const kickoff = new Date(`${match.date}T${match.time}:00-03:00`);
      return { ...match, kickoff };
    })
    .find((match) => match.kickoff.getTime() > now.getTime());

  if (!upcoming) {
    nextMatchCountdown.innerHTML = `
      <span>Contagem para o proximo jogo do Brasil</span>
      <strong>Fase de grupos encerrada</strong>
      <p>Agora o mural segue guardando as memorias, os palpites e a prestacao de contas da rua.</p>
    `;
    return;
  }

  nextMatchCountdown.innerHTML = `
    <span>Contagem para o proximo jogo do Brasil</span>
    <strong>${upcoming.homeTeam} x ${upcoming.awayTeam}</strong>
    <p>${upcoming.weekday}, ${upcoming.displayDate} as ${upcoming.time} - ${formatRelativeCountdown(upcoming.kickoff)}</p>
  `;
}

function renderPoolStats() {
  const ranking = buildRanking();
  const exactTotal = ranking.reduce((total, item) => total + item.exactHits, 0);

  poolStats.innerHTML = `
    <div class="pool-mini-stat"><span>Palpites enviados</span><strong>${bets.length}</strong></div>
    <div class="pool-mini-stat"><span>Lider atual</span><strong>${ranking[0]?.name || "Aguardando"}</strong></div>
    <div class="pool-mini-stat"><span>Placares exatos</span><strong>${exactTotal}</strong></div>
  `;
}

function renderRankingPodium(ranking) {
  rankingPodium.innerHTML = "";

  if (!ranking.length) {
    rankingPodium.innerHTML = '<div class="empty-state">O podio aparece assim que os moradores comecarem a palpitar.</div>';
    return;
  }

  const podiumLabels = ["Lider", "2o lugar", "3o lugar"];
  const podiumEmblems = ["Ouro", "Prata", "Bronze"];

  ranking.slice(0, 3).forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = `podium-card podium-${index + 1}`;
    card.innerHTML = `
      <span>${podiumLabels[index]}</span>
      <strong>${entry.name}</strong>
      <p>${entry.points} pts • ${entry.exactHits} placares exatos</p>
      <b>${podiumEmblems[index]}</b>
    `;
    rankingPodium.append(card);
  });
}

function renderBetForm() {
  betMatchList.innerHTML = "";

  worldCupMatches.forEach((match) => {
    const card = document.createElement("div");
    card.className = "bet-card";
    card.innerHTML = `
      <div class="bet-card-header">
        <div>
          <strong>${match.homeTeam} x ${match.awayTeam}</strong>
          <p class="bet-date">${match.weekday}, ${match.displayDate} - ${match.time}</p>
        </div>
        <span class="match-round">${match.round}</span>
      </div>
      <div class="score-fields">
        <label>
          ${match.homeTeam}
          <input type="number" min="0" required data-match-id="${match.id}" data-side="homeScore" placeholder="0">
        </label>
        <span>x</span>
        <label>
          ${match.awayTeam}
          <input type="number" min="0" required data-match-id="${match.id}" data-side="awayScore" placeholder="0">
        </label>
      </div>
    `;
    betMatchList.append(card);
  });
}

function renderResultsForm() {
  resultsList.innerHTML = "";

  worldCupMatches.forEach((match) => {
    const result = officialResults[match.id] || { homeScore: "", awayScore: "" };
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <strong>${match.homeTeam} x ${match.awayTeam}</strong>
      <p>${match.weekday}, ${match.displayDate} - ${match.time} - ${match.venue}</p>
      <div class="score-fields">
        <label>
          ${match.homeTeam}
          <input type="number" min="0" data-result-match-id="${match.id}" data-side="homeScore" value="${result.homeScore}">
        </label>
        <span>x</span>
        <label>
          ${match.awayTeam}
          <input type="number" min="0" data-result-match-id="${match.id}" data-side="awayScore" value="${result.awayScore}">
        </label>
      </div>
    `;
    resultsList.append(card);
  });
}

function renderRanking() {
  rankingRows.innerHTML = "";
  const ranking = buildRanking();
  renderRankingPodium(ranking);

  if (!ranking.length) {
    rankingRows.innerHTML = '<tr><td colspan="4">Ainda nao ha palpites cadastrados. O primeiro morador a palpitar ja estreia na lideranca.</td></tr>';
    return;
  }

  ranking.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.className = index < 3 ? `ranking-row ranking-row-${index + 1}` : "ranking-row";
    const badge = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`;
    row.innerHTML = `
      <td data-label="Posicao">${badge}</td>
      <td data-label="Nome"></td>
      <td data-label="Pontos">${entry.points}</td>
      <td data-label="Placares exatos">${entry.exactHits}</td>
    `;
    row.children[1].textContent = entry.name;
    rankingRows.append(row);
  });
}

function renderBetAdminTable() {
  betAdminRows.innerHTML = "";

  if (!bets.length) {
    betAdminRows.innerHTML = '<tr><td colspan="3">Nenhum palpite cadastrado ainda.</td></tr>';
    return;
  }

  bets
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"))
    .forEach((bet) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="Nome"></td>
        <td data-label="Palpites"><div class="bet-admin-summary"></div></td>
        <td class="row-actions" data-label="Acoes"></td>
      `;

      row.children[0].textContent = bet.name;

      const summary = row.querySelector(".bet-admin-summary");
      worldCupMatches.forEach((match) => {
        const prediction = bet.predictions.find((item) => item.matchId === match.id);
        const line = document.createElement("span");
        line.textContent = `${match.homeTeam} ${prediction?.homeScore ?? "-"} x ${prediction?.awayScore ?? "-"} ${match.awayTeam}`;
        summary.append(line);
      });

      const actions = row.querySelector(".row-actions");
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "small-danger";
      editButton.textContent = "Editar";
      editButton.addEventListener("click", () => editBetEntry(bet));
      actions.append(editButton);

      betAdminRows.append(row);
    });
}

function renderPool() {
  renderPoolStats();
  renderBetForm();
  renderResultsForm();
  renderRanking();
  renderBetAdminTable();
}

function renderGallery() {
  renderYearFilter();
  galleryGrid.innerHTML = "";

  const selectedYear = yearFilter.value;
  const items = selectedYear === "todos"
    ? gallery
    : gallery.filter((item) => String(item.year) === selectedYear);

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Ainda nao ha registros para mostrar. Adicione uma foto ou video da decoracao da rua.";
    galleryGrid.append(empty);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "media-card";

    const media = createMediaElement(item);

    const content = document.createElement("div");
    content.className = "media-card-content";
    content.innerHTML = `<strong>${item.year}</strong><p></p>`;
    content.querySelector("p").textContent = item.caption;

    if (isAdmin()) {
      const actions = document.createElement("div");
      actions.className = "row-actions";

      const edit = document.createElement("button");
      edit.className = "small-danger";
      edit.type = "button";
      edit.textContent = "Editar";
      edit.addEventListener("click", () => editGalleryItem(item));

      const remove = document.createElement("button");
      remove.className = "small-danger";
      remove.type = "button";
      remove.textContent = "Remover";
      remove.addEventListener("click", () => removeGalleryItem(item));
      actions.append(edit, remove);
      content.append(actions);
    }

    card.append(media, content);
    galleryGrid.append(card);
  });
}

async function editGalleryItem(item) {
  const currentYear = item.year;
  const currentCaption = item.caption;
  const yearValue = prompt("Edite o ano deste registro:", String(currentYear));
  if (yearValue === null) {
    return;
  }

  const nextYear = Number(yearValue);
  if (!Number.isInteger(nextYear) || nextYear < 1930 || nextYear > 2100) {
    showMessage("Digite um ano valido entre 1930 e 2100.", true);
    return;
  }

  const captionValue = prompt("Edite o titulo ou legenda deste registro:", currentCaption);
  if (captionValue === null) {
    return;
  }

  const nextCaption = captionValue.trim();
  if (!nextCaption) {
    showMessage("O titulo nao pode ficar vazio.", true);
    return;
  }

  const updatedItem = { ...item, year: nextYear, caption: nextCaption };

  if (!hasSupabase) {
    gallery = gallery.map((entry) => (entry.id === item.id ? updatedItem : entry));
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(galleryKey, gallery);
      }
      showMessage("Registro atualizado com sucesso.");
    } catch {
      saveStorage(galleryKey, gallery);
      showMessage("Nao foi possivel atualizar no banco compartilhado. Alteracao salva apenas neste navegador.", true);
    }
    renderGallery();
    return;
  }

  const { data, error } = await db.from("gallery_items").update({
    year: nextYear,
    caption: nextCaption
  }).eq("id", item.id).select().single();

  if (error) {
    showMessage("Nao foi possivel atualizar este registro.", true);
    return;
  }

  gallery = gallery.map((entry) => (entry.id === item.id ? data : entry));
  showMessage("Registro atualizado com sucesso.");
  renderGallery();
}

function renderQuotas() {
  quotaRows.innerHTML = "";

  const paidTotal = quotas
    .filter((item) => item.paid)
    .reduce((total, item) => total + Number(item.value), 0);
  const pendingTotal = quotas
    .filter((item) => !item.paid)
    .reduce((total, item) => total + Number(item.value), 0);

  quotaSummary.innerHTML = `
    <div class="summary-card"><span>Total pago</span><strong>${money(paidTotal)}</strong></div>
    <div class="summary-card"><span>Total pendente</span><strong>${money(pendingTotal)}</strong></div>
    <div class="summary-card"><span>Vizinhos cadastrados</span><strong>${quotas.length}</strong></div>
  `;

  if (!quotas.length) {
    quotaRows.innerHTML = '<tr><td colspan="4">Nenhuma cota cadastrada ainda.</td></tr>';
    return;
  }

  quotas.forEach((item) => {
    const row = document.createElement("tr");
    const statusClass = item.paid ? "paid" : "pending";
    const statusText = item.paid ? "Pago" : "Pendente";

    row.innerHTML = `
      <td data-label="Nome"></td>
      <td data-label="Valor">${money(item.value)}</td>
      <td data-label="Status"><span class="status ${statusClass}">${statusText}</span></td>
      <td class="row-actions" data-label="Acoes"></td>
    `;
    row.children[0].textContent = item.name;

    const actions = row.querySelector(".row-actions");
    if (isAdmin()) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "small-danger";
      toggle.textContent = item.paid ? "Marcar pendente" : "Marcar pago";
      toggle.addEventListener("click", () => toggleQuota(item));

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-danger";
      remove.textContent = "Remover";
      remove.addEventListener("click", () => removeQuota(item));

      actions.append(toggle, remove);
    } else {
      actions.textContent = "Somente administrador";
    }

    quotaRows.append(row);
  });
}

function formatDate(dateString) {
  if (!dateString) {
    return "-";
  }

  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) {
    return dateString;
  }

  return `${day}/${month}/${year}`;
}

function renderExpenses() {
  expenseRows.innerHTML = "";

  const collectedTotal = quotas
    .filter((item) => item.paid)
    .reduce((total, item) => total + Number(item.value), 0);
  const spentTotal = expenses
    .reduce((total, item) => total + Number(item.value), 0);
  const balance = collectedTotal - spentTotal;

  financeSummary.innerHTML = `
    <div class="summary-card"><span>Total arrecadado</span><strong>${money(collectedTotal)}</strong></div>
    <div class="summary-card"><span>Total gasto</span><strong>${money(spentTotal)}</strong></div>
    <div class="summary-card ${balance >= 0 ? "balance-positive" : "balance-negative"}"><span>Saldo atual</span><strong>${money(balance)}</strong></div>
  `;

  const categoryTotals = buildExpenseCategoryTotals();
  const highestCategory = Object.entries(categoryTotals).sort((left, right) => right[1] - left[1])[0];
  const spentPercent = collectedTotal > 0 ? Math.min((spentTotal / collectedTotal) * 100, 100) : 0;

  expenseCategoryBars.innerHTML = "";
  if (Object.keys(categoryTotals).length) {
    const maxValue = Math.max(...Object.values(categoryTotals));
    Object.entries(categoryTotals)
      .sort((left, right) => right[1] - left[1])
      .forEach(([category, value]) => {
        const item = document.createElement("div");
        item.className = "finance-category-item";
        item.innerHTML = `
          <div class="finance-category-head">
            <strong>${category}</strong>
            <span>${money(value)}</span>
          </div>
          <div class="finance-category-track">
            <div class="finance-category-fill" style="width:${maxValue ? (value / maxValue) * 100 : 0}%"></div>
          </div>
        `;
        expenseCategoryBars.append(item);
      });
  } else {
    expenseCategoryBars.innerHTML = '<div class="empty-state">As categorias vao aparecer aqui assim que a primeira despesa for cadastrada.</div>';
  }

  financeInsights.innerHTML = `
    <div class="finance-insight-card">
      <span>Categoria com maior gasto</span>
      <strong>${highestCategory ? highestCategory[0] : "Aguardando despesas"}</strong>
      <p>${highestCategory ? money(highestCategory[1]) : "Nenhuma despesa registrada ainda."}</p>
    </div>
    <div class="finance-insight-card">
      <span>Uso da arrecadacao</span>
      <strong>${spentPercent.toFixed(0)}%</strong>
      <p>${collectedTotal > 0 ? `${money(spentTotal)} de ${money(collectedTotal)} ja foram usados.` : "Cadastre cotas pagas para acompanhar esse percentual."}</p>
    </div>
    <div class="finance-insight-card">
      <span>Registros da prestacao</span>
      <strong>${expenses.length}</strong>
      <p>${expenses.length ? "Lancamentos publicados no livro-caixa da decoracao." : "Nenhum gasto registrado ate o momento."}</p>
    </div>
  `;

  if (!expenses.length) {
    expenseRows.innerHTML = '<tr><td colspan="6">Nenhuma despesa cadastrada ainda.</td></tr>';
    return;
  }

  expenses.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Data">${formatDate(item.expense_date || item.date)}</td>
      <td data-label="Categoria">${item.category || "-"}</td>
      <td data-label="Descricao"></td>
      <td data-label="Comprovante"></td>
      <td data-label="Valor">${money(item.value)}</td>
      <td class="row-actions" data-label="Acoes"></td>
    `;
    row.children[2].textContent = item.description;

    const receiptCell = row.children[3];
    if (item.receipt_url) {
      const link = document.createElement("a");
      link.href = item.receipt_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "receipt-link";
      link.textContent = "Ver comprovante";
      receiptCell.append(link);
    } else {
      receiptCell.textContent = "-";
    }

    const actions = row.querySelector(".row-actions");
    if (isAdmin()) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-danger";
      remove.textContent = "Remover";
      remove.addEventListener("click", () => removeExpense(item));
      actions.append(remove);
    } else {
      actions.textContent = "Somente administrador";
    }

    expenseRows.append(row);
  });
}

async function persistPoolData(successMessage, fallbackKey, fallbackValue, errorMessage) {
  try {
    if (hasJsonBlob) {
      await saveJsonBlob();
    } else {
      saveStorage(fallbackKey, fallbackValue);
    }
    showMessage(successMessage);
  } catch {
    saveStorage(fallbackKey, fallbackValue);
    showMessage(errorMessage, true);
  }
}

async function saveBet() {
  const name = bettorName.value.trim();
  const normalizedName = normalizeName(name);
  const predictions = worldCupMatches.map((match) => {
    const homeInput = betForm.querySelector(`[data-match-id="${match.id}"][data-side="homeScore"]`);
    const awayInput = betForm.querySelector(`[data-match-id="${match.id}"][data-side="awayScore"]`);
    return {
      matchId: match.id,
      homeScore: Number(homeInput.value),
      awayScore: Number(awayInput.value)
    };
  });

  bets = [
    {
      id: createId(),
      name,
      normalizedName,
      predictions,
      createdAt: new Date().toISOString()
    },
    ...bets.filter((entry) => entry.normalizedName !== normalizedName)
  ];

  await persistPoolData(
    "Palpite salvo com sucesso no bolao.",
    betKey,
    bets,
    "Nao foi possivel salvar no banco compartilhado. O palpite ficou salvo apenas neste navegador."
  );

  betForm.reset();
  renderPool();
}

async function saveOfficialResults() {
  officialResults = worldCupMatches.reduce((accumulator, match) => {
    const homeInput = resultsForm.querySelector(`[data-result-match-id="${match.id}"][data-side="homeScore"]`);
    const awayInput = resultsForm.querySelector(`[data-result-match-id="${match.id}"][data-side="awayScore"]`);

    return {
      ...accumulator,
      [match.id]: {
        homeScore: homeInput.value === "" ? "" : Number(homeInput.value),
        awayScore: awayInput.value === "" ? "" : Number(awayInput.value)
      }
    };
  }, {});

  await persistPoolData(
    "Resultados oficiais atualizados.",
    resultKey,
    officialResults,
    "Nao foi possivel salvar os resultados no banco compartilhado. Eles ficaram salvos apenas neste navegador."
  );

  renderPool();
}

async function editBetEntry(bet) {
  const updatedPredictions = [];

  for (const match of worldCupMatches) {
    const currentPrediction = bet.predictions.find((item) => item.matchId === match.id) || {
      homeScore: 0,
      awayScore: 0
    };

    const nextHomeValue = prompt(
      `Edite o palpite de ${bet.name} para ${match.homeTeam} x ${match.awayTeam}.\nGols de ${match.homeTeam}:`,
      String(currentPrediction.homeScore)
    );

    if (nextHomeValue === null) {
      return;
    }

    const nextAwayValue = prompt(
      `Edite o palpite de ${bet.name} para ${match.homeTeam} x ${match.awayTeam}.\nGols de ${match.awayTeam}:`,
      String(currentPrediction.awayScore)
    );

    if (nextAwayValue === null) {
      return;
    }

    const homeScore = Number(nextHomeValue);
    const awayScore = Number(nextAwayValue);

    if (!Number.isInteger(homeScore) || homeScore < 0 || !Number.isInteger(awayScore) || awayScore < 0) {
      showMessage("Os placares precisam ser numeros inteiros iguais ou maiores que zero.", true);
      return;
    }

    updatedPredictions.push({
      matchId: match.id,
      homeScore,
      awayScore
    });
  }

  bets = bets.map((entry) => (
    entry.id === bet.id
      ? { ...entry, predictions: updatedPredictions, updatedAt: new Date().toISOString() }
      : entry
  ));

  await persistPoolData(
    "Palpite atualizado com sucesso.",
    betKey,
    bets,
    "Nao foi possivel salvar a edicao no banco compartilhado. Alteracao salva apenas neste navegador."
  );

  renderPool();
}

async function saveGalleryLink(url) {
  const item = {
    id: createId(),
    year: Number(mediaYear.value),
    caption: mediaCaption.value.trim(),
    type: guessMediaType(url),
    externalUrl: url
  };

  gallery.unshift(item);

  try {
    if (hasSupabase) {
      const { data, error } = await db.from("gallery_items").insert({
        year: item.year,
        caption: item.caption,
        media_url: item.externalUrl,
        media_path: "",
        media_type: item.type
      }).select().single();

      if (error) {
        throw error;
      }

      gallery = [data, ...gallery.filter((entry) => entry.id !== item.id)];
    } else if (hasJsonBlob) {
      await saveJsonBlob();
    } else {
      saveStorage(galleryKey, gallery);
    }

    mediaForm.reset();
    showMessage("Link salvo no banco persistente compartilhado.");
    renderGallery();
  } catch {
    gallery = gallery.filter((entry) => entry.id !== item.id);
    showMessage("Nao foi possivel salvar o link no banco. Tente novamente.", true);
    renderGallery();
  }
}

async function saveGalleryItem(file) {
  const validFile = await validateMediaFile(file);
  if (!validFile) {
    return;
  }

  const item = {
    id: createId(),
    year: Number(mediaYear.value),
    caption: mediaCaption.value.trim(),
    type: file.type
  };

  if (hasCloudinary && !hasSupabase) {
    showMessage("Enviando midia para o storage...");
    try {
      const upload = await uploadToCloudinary(file, item);
      const savedItem = {
        ...item,
        externalUrl: upload.secure_url,
        type: file.type || upload.resource_type
      };

      gallery.unshift(savedItem);
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(galleryKey, gallery);
      }

      mediaForm.reset();
      showMessage("Midia salva no storage e publicada na galeria.");
      renderGallery();
    } catch {
      showMessage("Nao foi possivel enviar o arquivo para o storage. Confira a configuracao do Cloudinary.", true);
    }
    return;
  }

  if (!hasSupabase) {
    if (!canStoreFileInJson(file)) {
      showMessage("Este arquivo e grande para o banco atual. Para salvar videos de ate 30 segundos como arquivo, configure Cloudinary ou Supabase Storage.", true);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      gallery.unshift({ ...item, dataUrl: reader.result });
      try {
        if (hasJsonBlob) {
          await saveJsonBlob();
          showMessage("Registro salvo no banco persistente compartilhado.");
        } else {
          saveStorage(galleryKey, gallery);
        }
      } catch {
        gallery = gallery.filter((entry) => entry.id !== item.id);
        saveStorage(galleryKey, gallery);
        showMessage("Nao foi possivel salvar no banco. O registro nao foi publicado.", true);
      }
      mediaForm.reset();
      renderGallery();
    });
    reader.readAsDataURL(file);
    return;
  }

  const extension = file.name.split(".").pop() || "midia";
  const mediaPath = `${item.year}/${item.id}.${extension}`;
  const upload = await db.storage
    .from(config.mediaBucket)
    .upload(mediaPath, file, { contentType: file.type, upsert: false });

  if (upload.error) {
    showMessage("Nao foi possivel enviar a midia. Confira o bucket do Supabase.", true);
    return;
  }

  const { data: publicUrl } = db.storage
    .from(config.mediaBucket)
    .getPublicUrl(mediaPath);

  const { data, error } = await db.from("gallery_items").insert({
    year: item.year,
    caption: item.caption,
    media_url: publicUrl.publicUrl,
    media_path: mediaPath,
    media_type: file.type
  }).select().single();

  if (error) {
    showMessage("Midia enviada, mas o registro nao foi salvo no banco.", true);
    return;
  }

  gallery.unshift(data);
  mediaForm.reset();
  showMessage("Registro salvo no banco persistente.");
  renderGallery();
}

async function removeGalleryItem(item) {
  if (!hasSupabase) {
    gallery = gallery.filter((entry) => entry.id !== item.id);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(galleryKey, gallery);
      }
    } catch {
      saveStorage(galleryKey, gallery);
      showMessage("Nao foi possivel atualizar o banco. Alteracao salva apenas neste navegador.", true);
    }
    renderGallery();
    return;
  }

  const { error } = await db.from("gallery_items").delete().eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel remover o registro.", true);
    return;
  }

  if (item.media_path) {
    await db.storage.from(config.mediaBucket).remove([item.media_path]);
  }
  gallery = gallery.filter((entry) => entry.id !== item.id);
  renderGallery();
}

async function saveQuota() {
  const item = {
    id: createId(),
    name: quotaName.value.trim(),
    value: Number(quotaValue.value),
    paid: quotaPaid.value === "true"
  };

  if (!hasSupabase) {
    quotas.push(item);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
        showMessage("Cota salva no banco persistente compartilhado.");
      } else {
        saveStorage(quotaKey, quotas);
      }
    } catch {
      saveStorage(quotaKey, quotas);
      showMessage("Nao foi possivel salvar no banco. Cota salva apenas neste navegador.", true);
    }
    quotaForm.reset();
    renderQuotas();
    renderExpenses();
    return;
  }

  const { data, error } = await db.from("quotas").insert({
    name: item.name,
    value: item.value,
    paid: item.paid
  }).select().single();

  if (error) {
    showMessage("Nao foi possivel salvar a cota no banco.", true);
    return;
  }

  quotas.unshift(data);
  quotaForm.reset();
  showMessage("Cota salva no banco persistente.");
  renderQuotas();
  renderExpenses();
}

async function toggleQuota(item) {
  if (!hasSupabase) {
    quotas = quotas.map((entry) => (
      entry.id === item.id ? { ...entry, paid: !entry.paid } : entry
    ));
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(quotaKey, quotas);
      }
    } catch {
      saveStorage(quotaKey, quotas);
      showMessage("Nao foi possivel atualizar o banco. Alteracao salva apenas neste navegador.", true);
    }
    renderQuotas();
    renderExpenses();
    return;
  }

  const { error } = await db.from("quotas").update({ paid: !item.paid }).eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel atualizar a cota.", true);
    return;
  }

  quotas = quotas.map((entry) => (
    entry.id === item.id ? { ...entry, paid: !entry.paid } : entry
  ));
  renderQuotas();
  renderExpenses();
}

async function removeQuota(item) {
  if (!hasSupabase) {
    quotas = quotas.filter((entry) => entry.id !== item.id);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(quotaKey, quotas);
      }
    } catch {
      saveStorage(quotaKey, quotas);
      showMessage("Nao foi possivel atualizar o banco. Alteracao salva apenas neste navegador.", true);
    }
    renderQuotas();
    renderExpenses();
    return;
  }

  const { error } = await db.from("quotas").delete().eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel remover a cota.", true);
    return;
  }

  quotas = quotas.filter((entry) => entry.id !== item.id);
  renderQuotas();
  renderExpenses();
}

async function saveExpense() {
  const item = {
    id: createId(),
    date: expenseDate.value,
    category: expenseCategory.value,
    description: expenseDescription.value.trim(),
    receipt_url: expenseReceipt.value.trim(),
    value: Number(expenseValue.value)
  };

  if (!hasSupabase) {
    expenses.unshift(item);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
        showMessage("Despesa salva no banco persistente compartilhado.");
      } else {
        saveStorage(expenseKey, expenses);
      }
    } catch {
      saveStorage(expenseKey, expenses);
      showMessage("Nao foi possivel salvar no banco. Despesa salva apenas neste navegador.", true);
    }
    expenseForm.reset();
    expenseDate.valueAsDate = new Date();
    renderExpenses();
    return;
  }

  const { data, error } = await db.from("expenses").insert({
    category: item.category,
    description: item.description,
    receipt_url: item.receipt_url || null,
    value: item.value,
    expense_date: item.date
  }).select().single();

  if (error) {
    showMessage("Nao foi possivel salvar a despesa no banco.", true);
    return;
  }

  expenses.unshift(data);
  expenseForm.reset();
  expenseDate.valueAsDate = new Date();
  showMessage("Despesa salva no banco persistente.");
  renderExpenses();
}

async function removeExpense(item) {
  if (!hasSupabase) {
    expenses = expenses.filter((entry) => entry.id !== item.id);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(expenseKey, expenses);
      }
    } catch {
      saveStorage(expenseKey, expenses);
      showMessage("Nao foi possivel atualizar o banco. Alteracao salva apenas neste navegador.", true);
    }
    renderExpenses();
    return;
  }

  const { error } = await db.from("expenses").delete().eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel remover a despesa.", true);
    return;
  }

  expenses = expenses.filter((entry) => entry.id !== item.id);
  renderExpenses();
}

mediaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const [file] = mediaFile.files;
  const link = mediaLink.value.trim();

  if (!file && !link) {
    showMessage("Escolha um arquivo ou cole um link de foto/video.", true);
    return;
  }

  if (link) {
    await saveGalleryLink(link);
    return;
  }

  if (file) {
    await saveGalleryItem(file);
  }
});

yearFilter.addEventListener("change", renderGallery);

clearGallery.addEventListener("click", async () => {
  if (!gallery.length || !confirm("Deseja apagar todos os registros da galeria?")) {
    return;
  }

  if (!hasSupabase) {
    gallery = [];
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(galleryKey, gallery);
      }
    } catch {
      saveStorage(galleryKey, gallery);
      showMessage("Nao foi possivel limpar o banco. Galeria limpa apenas neste navegador.", true);
    }
    renderGallery();
    return;
  }

  const paths = gallery.map((item) => item.media_path).filter(Boolean);
  const { error } = await db.from("gallery_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    showMessage("Nao foi possivel limpar a galeria.", true);
    return;
  }
  if (paths.length) {
    await db.storage.from(config.mediaBucket).remove(paths);
  }
  gallery = [];
  renderGallery();
});

quotaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveQuota();
});

betForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveBet();
});

resultsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveOfficialResults();
});

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveExpense();
});

visitorAccess.addEventListener("click", () => {
  setAccessMode("visitor");
});

adminAccess.addEventListener("click", () => {
  adminLoginForm.hidden = !adminLoginForm.hidden;
  if (!adminLoginForm.hidden) {
    adminPassword.focus();
  }
});

adminLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (adminPassword.value === config.adminPassword) {
    adminPassword.value = "";
    loginMessage.textContent = "";
    setAccessMode("admin");
    return;
  }

  loginMessage.textContent = "Senha incorreta.";
});

logoutButton.addEventListener("click", () => {
  accessMode = "";
  localStorage.removeItem(accessKey);
  adminLoginForm.hidden = true;
  loginMessage.textContent = "";
  applyAccessMode();
});

openFullSchedule.addEventListener("click", () => {
  toggleFullScheduleModal(true);
});

fullScheduleNavLink.addEventListener("click", (event) => {
  event.preventDefault();
  toggleFullScheduleModal(true);
});

closeFullSchedule.addEventListener("click", () => {
  toggleFullScheduleModal(false);
});

closeFullScheduleButton.addEventListener("click", () => {
  toggleFullScheduleModal(false);
});

fullScheduleStageFilter.addEventListener("change", () => {
  renderFullSchedule();
});

fullScheduleSearch.addEventListener("input", () => {
  renderFullSchedule();
});

applyAccessMode();
expenseDate.valueAsDate = new Date();
populateScheduleStageFilter();
renderFullSchedule();
updateNextMatchCountdown();
window.setInterval(updateNextMatchCountdown, 60000);
renderMatches();
renderPool();
loadData();
