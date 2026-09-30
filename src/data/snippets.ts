// Code shown in the project mockups. Each excerpt is verbatim from `file` on `branch` of the
// project's repository, with omissions marked by "…". The Crow terminal session was recorded
// from the backend built from its repository (requests as in test/requests.http, output piped to jq).

export interface Snippet {
  /** Repository directory name (the project's `repo`). */
  repo: string;
  branch: string;
  /** Path in the repository, shown in the mockup's title bar. */
  file: string;
  /** Shiki grammar. */
  lang: string;
  code: string;
}

export const SNIPPETS = {
  "driving-planner": {
    repo: "sommerprojekt-wmc-summer-project-brunner-mostbauer-maric",
    branch: "main",
    file: "backend/src/schools/school_service.ts",
    lang: "typescript",
    code: "public getAllSchools(currentUserId?: number): DrivingSchool[] {\n  const unit = Unit.createReadonly();\n  try {\n    const schools = this.schoolRepo.getAll(unit);\n    if (currentUserId) {\n      const user = UserRepository.Instance.getById(unit, currentUserId);\n      if (user && user.Latitude != null && user.Longitude != null) {\n        const uLat = user.Latitude;\n        const uLon = user.Longitude;\n        for (const school of schools) {\n          if (school.Latitude != null && school.Longitude != null) {\n            school.distance = calculateDistance(uLat, uLon, school.Latitude, school.Longitude);\n          } else {\n            school.distance = null;\n          }\n        }\n        // Sort schools: those with distance closest first, those without distance at the end\n        schools.sort((a, b) => {\n          if (a.distance != null && b.distance != null) {\n            return a.distance - b.distance;\n          }\n          if (a.distance != null) return -1;\n          if (b.distance != null) return 1;\n          return 0;\n        });\n      }\n    }\n    return schools;\n",
  },
  "driving-planner-distance": {
    repo: "sommerprojekt-wmc-summer-project-brunner-mostbauer-maric",
    branch: "main",
    file: "backend/src/schools/distance_helper.ts",
    lang: "typescript",
    code: "export function calculateDistance(\n  lat1: number,\n  lon1: number,\n  lat2: number,\n  lon2: number\n): number {\n  const R = 6371; // Earth's radius in kilometers\n  const dLat = ((lat2 - lat1) * Math.PI) / 180;\n  const dLon = ((lon2 - lon1) * Math.PI) / 180;\n\n  const a =\n    Math.sin(dLat / 2) * Math.sin(dLat / 2) +\n    Math.cos((lat1 * Math.PI) / 180) *\n      Math.cos((lat2 * Math.PI) / 180) *\n      Math.sin(dLon / 2) *\n      Math.sin(dLon / 2);\n\n  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));\n  return R * c;\n}\n",
  },
  "driving-planner-geocoder": {
    repo: "sommerprojekt-wmc-summer-project-brunner-mostbauer-maric",
    branch: "main",
    file: "backend/src/schools/school_geocoder.ts",
    lang: "typescript",
    code: "for (const school of schools) {\n  try {\n    console.log(`Geocoding school ID ${school.DrivingSchoolId}: \"${school.Location}\"`);\n    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(school.Location)}&format=json&limit=1`;\n    const response = await fetch(url, {\n      headers: {\n        \"User-Agent\": \"DrivingSchoolApp/1.0 (contact: admin@admin.com)\"\n      }\n    });\n\n    if (response.ok) {\n      const data = (await response.json()) as any[];\n      if (data && data.length > 0) {\n        const lat = parseFloat(data[0].lat);\n        const lon = parseFloat(data[0].lon);\n  // …\n  // Wait 1 second to respect Nominatim API terms of service\n  await new Promise((resolve) => setTimeout(resolve, 1000));\n}\n",
  },
  "flashcards": {
    repo: "2526-3bhif-syp-project-flashcards",
    branch: "develop",
    file: "frontend/src/main/java/at/htlleonding/flashcards/model/WeightedCardAlgorithm.java",
    lang: "java",
    code: "static final int WEIGHT_FALSCH    = 8;\nstatic final int WEIGHT_SCHWIERIG = 4;\nstatic final int WEIGHT_OK        = 2;\nstatic final int WEIGHT_LEICHT    = 1;\nstatic final int WEIGHT_DEFAULT   = 3;\n// …\npublic Card selectNext(List<Card> cards, Map<String, Integer> weights) {\n    if (cards == null || cards.isEmpty()) return null;\n\n    int totalWeight = 0;\n    for (Card c : cards) {\n        totalWeight += weights.getOrDefault(c.getId(), WEIGHT_DEFAULT);\n    }\n\n    int pick = rng.nextInt(totalWeight);\n    int cumulative = 0;\n    for (Card c : cards) {\n        cumulative += weights.getOrDefault(c.getId(), WEIGHT_DEFAULT);\n        if (pick < cumulative) return c;\n    }\n    return cards.get(cards.size() - 1);\n}\n",
  },
  "flashcards-rating": {
    repo: "2526-3bhif-syp-project-flashcards",
    branch: "develop",
    file: "frontend/src/main/java/at/htlleonding/flashcards/model/WeightedCardAlgorithm.java",
    lang: "java",
    code: "public void recordRating(String cardId, String rating, Map<String, Integer> weights) {\n    if (cardId == null || rating == null) return;\n    int weight = switch (rating.toUpperCase()) {\n        case \"FALSCH\"    -> WEIGHT_FALSCH;\n        case \"SCHWIERIG\" -> WEIGHT_SCHWIERIG;\n        case \"OK\"        -> WEIGHT_OK;\n        case \"LEICHT\"    -> WEIGHT_LEICHT;\n        default          -> WEIGHT_DEFAULT;\n    };\n    weights.put(cardId, weight);\n}\n",
  },
  "flashcards-stats": {
    repo: "2526-3bhif-syp-project-flashcards",
    branch: "develop",
    file: "frontend/src/main/java/at/htlleonding/flashcards/model/StatisticsAggregator.java",
    lang: "java",
    code: "public StatisticsAggregator filtered(Timeframe timeframe) {\n    if (timeframe == Timeframe.ALL) return this;\n    LocalDate cutoff = switch (timeframe) {\n        case DAY   -> LocalDate.now().minusDays(1);\n        case WEEK  -> LocalDate.now().minusWeeks(1);\n        case MONTH -> LocalDate.now().minusMonths(1);\n        default    -> LocalDate.MIN;\n    };\n    List<StudyRecord> filtered = records.stream()\n            .filter(r -> toLocalDate(r) != null && !toLocalDate(r).isBefore(cutoff))\n            .collect(Collectors.toList());\n    return new StatisticsAggregator(filtered);\n}\n",
  },
  "vector-viewer": {
    repo: "3d-vector-graphic",
    branch: "main",
    file: "VectorViewer/Program.cs",
    lang: "csharp",
    code: "var camera = new Camera3D {\n    Position = new Vector3(6, 5, 6),\n    Target = Vector3.Zero,\n    Up = Vector3.UnitY,\n    FovY = 45,\n    Projection = CameraProjection.Perspective\n};\nvar panel = new VectorPanel();\n\n\nwhile (!WindowShouldClose())\n{\n    UpdateCamera(ref camera, CameraMode.Orbital);\n\n    BeginDrawing();\n    ClearBackground(Color.RayWhite);\n\n\n    GridSetup.SetupGrid(panel.Vectors.Count == 0 ? [] : [.. panel.Vectors.Select(s => (s.Start, s.End))], camera);\n    BeginMode3D(camera);\n    foreach (var vec in panel.Vectors)\n        vec.End.DrawArrow(vec.Start, vec.Color);\n\n    EndMode3D();\n    panel.Draw();\n    DrawText(\"Mouse wheel: zoom\", 10, 10, 20, Color.DarkGray);\n    EndDrawing();\n}\n\nCloseWindow();\n",
  },
  "vector-viewer-arrow": {
    repo: "3d-vector-graphic",
    branch: "main",
    file: "VectorViewerClasses/VectorExtension.cs",
    lang: "csharp",
    code: "public static void DrawArrow(this Vector3 vector, Vector3 start, Color color)\n{\n    var dir = vector - start;\n    float len = dir.Length();\n    if (len < 0.0001f) return;\n    float headLen = MathF.Min(0.3f, len * 0.3f);\n    var headStart = start + Vector3.Normalize(dir) * (len - headLen);\n\n    DrawCylinderEx(start, headStart, 0.03f, 0.03f, 12, color);  \n    DrawCylinderEx(headStart, vector, 0.1f, 0f, 12, color);\n}\n",
  },
  "vector-viewer-label": {
    repo: "3d-vector-graphic",
    branch: "main",
    file: "VectorViewerClasses/GridSetup.cs",
    lang: "csharp",
    code: "private static void DrawLabel(string text, Vector3 pos, Camera3D cam, Color color)\n{\n    var forward = Vector3.Normalize(cam.Target - cam.Position);\n    if (Vector3.Dot(pos - cam.Position, forward) <= 0) return;\n\n    Vector2 screen = GetWorldToScreen(pos, cam);\n    int w = MeasureText(text, 16);\n    DrawText(text, (int)screen.X - w / 2, (int)screen.Y + 4, 16, color);\n}\n",
  },
  "crow": {
    repo: "Crow-demo-backend",
    branch: "main",
    file: "test/requests.http",
    lang: "shellsession",
    code: "$ curl -X POST localhost:3000/devices -H 'Content-Type: application/json' \\\n    -d '{\"id\":1,\"type\":\"Laptop\",\"brand\":\"Lenovo\",\"model\":\"ThinkPad X1\",\"batteryLifeHours\":14}'\nHTTP/1.1 201 Created\n$ curl -X POST localhost:3000/devices -H 'Content-Type: application/json' \\\n    -d '{\"id\":2,\"type\":\"Server\",\"brand\":\"Dell\",\"model\":\"PowerEdge R760\",\"ramGB\":256,\"cores\":32}'\nHTTP/1.1 201 Created\n$ curl -s localhost:3000/devices | jq\n{\n  \"devices\": [\n    {\n      \"Description\": \"Id:1;Brand:Lenovo;Model:ThinkPad X1;BatteryLifeHours:14\"\n    },\n    {\n      \"Description\": \"Id:2;Brand:Dell;Model:PowerEdge R760;RamGB:256;Cores:32\"\n    }\n  ]\n}\n$ curl -X POST localhost:3000/devices -d '{\"id\":1,\"type\":\"Laptop\", …}'\nCan't be added. Check if id is unique.\n",
  },
  "crow-route": {
    repo: "Crow-demo-backend",
    branch: "main",
    file: "src/main.cpp",
    lang: "cpp",
    code: "CROW_ROUTE(app, \"/devices\")\n.methods(crow::HTTPMethod::GET)\n([&repo]{\n    auto list = repo.getAllDevices();\n\n    crow::json::wvalue::list json_list;\n\n    for(Device* d: list) {\n        crow::json::wvalue json_value;\n        json_value[\"Description\"]=d->getSpecs();\n\n        json_list.push_back(std::move(json_value));\n    }\n\n    crow::json::wvalue response;\n    response[\"devices\"]=std::move(json_list);\n\n    return crow::response(crow::status::OK, response);\n});\n",
  },
  "crow-validate": {
    repo: "Crow-demo-backend",
    branch: "main",
    file: "src/main.cpp",
    lang: "cpp",
    code: "if(type_device == \"Laptop\") {\n    int batteryLife = body[\"batteryLifeHours\"].i();\n    if(!batteryLife || batteryLife < 0) {\n        throw std::runtime_error(\"Battery life hours can't be less then 0\");\n    }\n    Laptop* laptop = new Laptop(id, brand, model, batteryLife);\n    return laptop;\n}else if(type_device == \"Server\") {\n    int ramGB = body[\"ramGB\"].i();\n    int cores = body[\"cores\"].i();\n\n    if(!ramGB || ramGB <0 || !cores || cores < 0) {\n        throw std::runtime_error(\"ramGB is mandatory and can't be less then 0 and cores are also mandatory and also can't be less then 0.\");\n    }\n    Server* server = new Server(id, brand, model, ramGB, cores);\n    return server;\n}\n",
  },
  "driving-tracker": {
    repo: "DrivingTracker",
    branch: "main",
    file: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/model/TripManager.java",
    lang: "java",
    code: "public class TripManager {\n    private static ObservableList<Trip> trips = FXCollections.observableArrayList();\n    private final DatabaseConnection connection = new DatabaseConnection();\n    private FilteredList<Trip> filteredList = new FilteredList<>(trips);\n    private SortedList<Trip> sortedList = new SortedList<>(this.filteredList);\n    private SimpleIntegerProperty countOfTrips = new SimpleIntegerProperty();\n\n    public TripManager() {\n        sortedList.setComparator((a,b) -> b.getDate().compareTo(a.getDate()));\n        countOfTrips.bind(Bindings.size(sortedList));\n    }\n    // …\n    public void applyFilter(Predicate<Trip> tripPredicate) {\n        filteredList.setPredicate(tripPredicate);\n    }\n    // …\n    public double getSumKilometers() {\n        return trips.stream().mapToDouble(t -> t.getEndKm() - t.getStartKm()).sum();\n    }\n}\n",
  },
  "driving-tracker-schema": {
    repo: "DrivingTracker",
    branch: "main",
    file: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/model/DatabaseConnection.java",
    lang: "java",
    code: "statement.addBatch(\"CREATE TABLE IF NOT EXISTS TRIP(\" +\n        \"    ID INT PRIMARY KEY,\" +\n        \"    Date DATE NOT NULL,\" +\n        \"    Start_Km DOUBLE NOT NULL,\" +\n        \"    End_Km DOUBLE NOT NULL,\" +\n        \"    Start_City VARCHAR2(100) NOT NULL,\" +\n        \"    End_City VARCHAR2(100) NOT NULL,\" +\n        \"    Info VARCHAR2(1000) NOT NULL\" +\n        \");\" +\n        \"CREATE TABLE IF NOT EXISTS Trip_Condition (\" +\n        \"    Trip_Id INT,\" +\n        \"    Condition VARCHAR2(50),\" +\n        \"    PRIMARY KEY (Trip_Id, Condition),\" +\n        \"    FOREIGN KEY (Trip_Id) REFERENCES TRIP(ID) ON DELETE CASCADE\" +\n        \");\");\n",
  },
  "driving-tracker-progress": {
    repo: "DrivingTracker",
    branch: "main",
    file: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/controller/StatisticController.java",
    lang: "java",
    code: "private void updateProgress(Measure measure) {\n    measureKm.setText(Measure.getValue(measure) + \" km\");\n    double progress = this.manager.getSumKilometers() / Measure.getValue(measure);\n    progressBar.setProgress(progress);\n    this.percentage.setText(String.format(\"%.1f %%\",progress *100));\n    // …\n}\n",
  },
  "rpn": {
    repo: "RpnCalculator",
    branch: "main",
    file: "avaloniarpncalculator/RpnCalc.Logic/StackCalculator.cs",
    lang: "csharp",
    code: "public void Push(double value)\n{\n    if (_stack.Count >= 5) throw new RpnStackOverflowException(\"Der Stack ist voll.\\n Es können keine weiteren Werte hinzugefügt werden.\");\n    _stack.Push(value);\n}\n// …\npublic void Divide()\n{\n    if (_stack.Count < 2)\n    {\n        throw new RpnStackUnderflowException(\"Es sind nicht genügend Elemente vorhanden,\\n um eine Division durchzuführen.\");\n    }\n\n    double second = _stack.Pop();\n    if (second == 0)\n    {\n        _stack.Push(second);\n        throw new RpnDivisionByZeroException(\"Man kann nicht durch Null dividieren.\");\n    }\n\n    double first = _stack.Pop();\n    double result = first / second;\n    _stack.Push(result);\n}\n",
  },
  "rpn-function": {
    repo: "RpnCalculator",
    branch: "main",
    file: "avaloniarpncalculator/RpnCalc.Logic/FunctionCalculator.cs",
    lang: "csharp",
    code: "public static double Calculate(double[] stack, double x)\n{\n    stack = stack.Reverse().ToArray();\n    double result = 0;\n    int pow = 0;\n\n    for (int i = 0; i < stack.Length; i++)\n    {\n        if (i == 0)\n        {\n            result += stack[i];\n        }\n        else\n        {\n            result += stack[i] * Math.Pow(x, pow); \n        }\n\n        pow++;\n    }\n    return result;\n}\n",
  },
  "rpn-keys": {
    repo: "RpnCalculator",
    branch: "main",
    file: "avaloniarpncalculator/RpnCalcApp/MainWindow.cs",
    lang: "csharp",
    code: "private void KeyPressed(object sender, KeyEventArgs e)\n{ \n    var key = e.Key;\n    switch (key)\n    {\n        case Key.Enter:\n            OnOperationButtonClicked(new Button(){Tag = \"Enter\"}, null);\n            break;\n        case Key.Escape:\n            this.Close();\n            break;\n        case Key.Add:\n            OnActionButtonClicked(new Button(){Tag = \"+\"}, null);\n            break;\n        case Key.Subtract:\n            OnActionButtonClicked(new Button(){Tag = \"-\"}, null);\n            break;\n        // …\n        case Key.S:\n            OnOperationButtonClicked(new Button(){Tag = \"Swap\"}, null);\n            break;\n        case Key.C:\n            OnOperationButtonClicked(new Button(){Tag = \"Clear\"}, null);\n            break;\n    }\n\n    if (key >= Key.D0 && key <= Key.D9)\n    {\n        ButtonClickedDigits(new Button(){Tag = e.KeySymbol}, null);\n    }\n\n}\n",
  },
} satisfies Record<string, Snippet>;

export type SnippetId = keyof typeof SNIPPETS;
