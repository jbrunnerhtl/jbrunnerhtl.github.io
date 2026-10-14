// The architecture diagram of each featured project: layers, blocks and the links between them.
// Only structure lives here; every visible word is in src/i18n/dictionaries (projects.items.<id>
// .architecture), keyed by the ids below. Each block names the repository path it is based on, so
// the diagram can be rechecked against the source (verified against the repositories, Oct 2026).

import type { Dictionary } from "@/i18n/dictionaries/en";
import type { ProjectId } from "./portfolioData";

/** The visible words of a project's diagram, from the dictionary. */
export type ArchitectureTexts<P extends ProjectId = ProjectId> = Dictionary["projects"]["items"][P]["architecture"];

type LayerId<P extends ProjectId> = keyof ArchitectureTexts<P>["layers"] & string;
type BlockId<P extends ProjectId> = keyof ArchitectureTexts<P>["blocks"] & string;
type LinkId<P extends ProjectId> = keyof ArchitectureTexts<P>["links"] & string;

export interface ArchitectureBlock<B extends string = string> {
  id: B;
  /** Repository path(s) the block is based on. Not rendered; for rechecking. */
  source: string;
  /** A service outside the project, drawn with a dashed outline. */
  external?: boolean;
}

export interface ArchitectureRow<B extends string = string, K extends string = string> {
  blocks: ArchitectureBlock<B>[];
  /** How neighbouring blocks are joined: an arrow (default), a dashed arrow, or not at all. */
  joint?: "arrow" | "dashed" | "none";
  /** The row repeats: a return link from the last block back to the first, with this label. */
  loop?: K;
}

export interface ArchitectureLayer<L extends string = string, B extends string = string, K extends string = string> {
  id: L;
  rows: ArchitectureRow<B, K>[];
  /** The link down to the next layer: the block pairs it joins and its label. */
  next?: { pairs: [B, B][]; label?: K };
}

/** A diagram; with the default type arguments, any project's diagram. */
export interface ArchitectureDiagram<L extends string = string, B extends string = string, K extends string = string> {
  layers: ArchitectureLayer<L, B, K>[];
  /** Supporting tools below the diagram (technical names, the same in every language). */
  chips?: string[];
}

/** A project's diagram, limited to the layer, block and link ids its dictionary texts define. */
type ProjectDiagram<P extends ProjectId> = ArchitectureDiagram<LayerId<P>, BlockId<P>, LinkId<P>>;

export const ARCHITECTURE: { [P in ProjectId]: ProjectDiagram<P> } = {
  "driving-planner": {
    layers: [
      {
        id: "client",
        rows: [
          {
            blocks: [
              { id: "views", source: "frontend/driving_planer/src/main.ts, src/router/index.ts, src/views/" },
              { id: "stores", source: "frontend/driving_planer/src/stores/" },
              { id: "client", source: "frontend/driving_planer/src/api/client.ts, src/api/cache.ts, src/api/schoolService.ts" },
            ],
          },
        ],
        next: { pairs: [["client", "router"]], label: "rest" },
      },
      {
        id: "api",
        rows: [
          {
            blocks: [
              { id: "router", source: "backend/src/app.ts, backend/src/schools/school_router.ts, backend/src/middleware/auth_handlers.ts" },
              { id: "service", source: "backend/src/schools/school_service.ts, backend/src/schools/distance_helper.ts" },
              { id: "repository", source: "backend/src/schools/school_repository.ts" },
            ],
          },
        ],
        next: { pairs: [["service", "uow"], ["repository", "uow"]], label: "transaction" },
      },
      {
        id: "data",
        rows: [
          {
            blocks: [
              { id: "uow", source: "backend/src/unit.ts" },
              { id: "sqlite", source: "backend/src/unit.ts, backend/src/auth/auth_service.ts" },
            ],
          },
        ],
        next: { pairs: [["sqlite", "geocoder"]], label: "coordinates" },
      },
      {
        id: "background",
        rows: [
          {
            joint: "dashed",
            blocks: [
              { id: "geocoder", source: "backend/src/schools/school_geocoder.ts, backend/src/app.ts" },
              { id: "nominatim", source: "backend/src/schools/school_geocoder.ts", external: true },
            ],
          },
        ],
      },
    ],
    chips: ["Docker Compose", "Swagger", "Jest"],
  },

  // Branch develop. The study mode shuffles; CardSelector is tested but not used by the app.
  flashcards: {
    layers: [
      {
        id: "view",
        rows: [
          {
            blocks: [
              { id: "providers", source: "frontend/src/main/java/at/htlleonding/flashcards/model/TranslationProvider.java, model/ThemeProvider.java" },
              { id: "views", source: "frontend/src/main/java/at/htlleonding/flashcards/view/" },
            ],
          },
        ],
        next: { pairs: [["views", "presenter"]], label: "events" },
      },
      {
        id: "presenter",
        rows: [
          {
            joint: "none",
            blocks: [
              { id: "presenter", source: "frontend/src/main/java/at/htlleonding/flashcards/presenter/MainPresenter.java" },
              { id: "study", source: "frontend/src/main/java/at/htlleonding/flashcards/presenter/MainPresenter.java (Collections.shuffle)" },
            ],
          },
        ],
        next: { pairs: [["presenter", "model"], ["study", "model"]], label: "calls" },
      },
      {
        id: "model",
        rows: [
          {
            joint: "none",
            blocks: [
              { id: "model", source: "frontend/src/main/java/at/htlleonding/flashcards/model/Model.java, Deck.java, Card.java, StreakData.java" },
              { id: "stats", source: "frontend/src/main/java/at/htlleonding/flashcards/model/StatisticsAggregator.java" },
              { id: "selector", source: "frontend/src/main/java/at/htlleonding/flashcards/model/CardSelector.java, WeightedCardAlgorithm.java, RandomCardAlgorithm.java" },
            ],
          },
        ],
        next: { pairs: [["model", "persistence"]], label: "json" },
      },
      {
        id: "storage",
        rows: [{ blocks: [{ id: "persistence", source: "frontend/src/main/java/at/htlleonding/flashcards/model/Persistence.java" }] }],
      },
    ],
    chips: ["JUnit 5", "Mockito", "Maven", "AsciiDoc"],
  },

  "vector-viewer": {
    layers: [
      {
        id: "app",
        rows: [{ blocks: [{ id: "window", source: "VectorViewer/Program.cs" }] }],
        next: { pairs: [["window", "camera"]], label: "start" },
      },
      {
        id: "frame",
        rows: [
          {
            loop: "next",
            blocks: [
              { id: "camera", source: "VectorViewer/Program.cs (UpdateCamera with CameraMode.Orbital)" },
              { id: "grid", source: "VectorViewerClasses/GridSetup.cs" },
              { id: "arrows", source: "VectorViewerClasses/VectorExtension.cs" },
              { id: "panel", source: "VectorViewerClasses/VectorPanel.cs" },
            ],
          },
        ],
        next: { pairs: [["panel", "vec"], ["grid", "vec"], ["arrows", "vec"]], label: "vectors" },
      },
      {
        id: "model",
        rows: [{ blocks: [{ id: "vec", source: "VectorViewerClasses/Vec.cs, VectorViewerClasses/VectorPanel.cs" }] }],
      },
    ],
    chips: [".NET 10", "Raylib-cs"],
  },

  crow: {
    layers: [
      {
        id: "http",
        rows: [{ blocks: [{ id: "client", source: "test/requests.http", external: true }] }],
        next: { pairs: [["client", "routes"]], label: "json" },
      },
      {
        id: "app",
        rows: [
          {
            blocks: [
              { id: "routes", source: "src/main.cpp (create_getRoutes … create_deleteRoutes)" },
              { id: "check", source: "src/main.cpp (check_body)" },
              { id: "devices", source: "include/crow-backend/Device.hpp, Laptop.hpp, Server.hpp" },
            ],
          },
        ],
        next: { pairs: [["routes", "store"]], label: "device" },
      },
      {
        id: "storage",
        rows: [
          {
            joint: "dashed",
            blocks: [
              { id: "store", source: "include/crow-backend/InMemoryDeviceRepository.hpp, src/InMemoryDeviceRepository.cpp" },
              { id: "contract", source: "include/crow-backend/IDeviceRepository.hpp" },
            ],
          },
        ],
      },
    ],
    chips: ["CMake", "FetchContent", "Crow"],
  },

  "driving-tracker": {
    layers: [
      {
        id: "ui",
        rows: [
          {
            blocks: [
              { id: "views", source: "DrivingTracker/src/main/resources/at/htlleonding/drivingtracker/*.fxml" },
              { id: "controllers", source: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/controller/" },
            ],
          },
          { blocks: [{ id: "csv", source: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/controller/NavbarController.java, model/TripManager.java (getCSV)" }] },
        ],
        next: { pairs: [["controllers", "observable"], ["csv", "observable"]], label: "manager" },
      },
      {
        id: "lists",
        rows: [
          {
            blocks: [
              { id: "observable", source: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/model/TripManager.java" },
              { id: "filtered", source: "model/TripManager.java (setPredicate), controller/MainController.java (search predicate)" },
              { id: "sorted", source: "model/TripManager.java (setSortedListComparator), model/Sort.java" },
              { id: "listview", source: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/controller/MainController.java (trackerList)" },
            ],
          },
        ],
        next: { pairs: [["observable", "db"]], label: "jdbc" },
      },
      {
        id: "data",
        rows: [
          {
            blocks: [
              { id: "db", source: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/model/DatabaseConnection.java" },
              { id: "h2", source: "DrivingTracker/src/main/java/at/htlleonding/drivingtracker/model/DatabaseConnection.java (jdbc:h2:./trips, CREATE TABLE)" },
            ],
          },
        ],
      },
    ],
    chips: ["JavaFX", "H2", "JUnit", "Maven", "AsciiDoc"],
  },

  rpn: {
    layers: [
      {
        id: "app",
        rows: [
          {
            blocks: [
              { id: "window", source: "avaloniarpncalculator/RpnCalcApp/MainWindow.cs, RpnCalcApp/Program.cs" },
              { id: "graph", source: "avaloniarpncalculator/RpnCalcApp/DrawingWindow.cs" },
            ],
          },
          { blocks: [{ id: "tests", source: "avaloniarpncalculator/RpnCalc.Test/" }] },
        ],
        next: { pairs: [["window", "stack"], ["graph", "function"], ["tests", "stack"], ["tests", "function"]], label: "uses" },
      },
      {
        id: "logic",
        rows: [
          {
            joint: "none",
            blocks: [
              { id: "stack", source: "avaloniarpncalculator/RpnCalc.Logic/StackCalculator.cs" },
              { id: "function", source: "avaloniarpncalculator/RpnCalc.Logic/FunctionCalculator.cs" },
            ],
          },
        ],
        next: { pairs: [["stack", "contract"], ["stack", "errors"]], label: "implements" },
      },
      {
        id: "core",
        rows: [
          {
            joint: "none",
            blocks: [
              { id: "contract", source: "avaloniarpncalculator/RpnCalc.Core/IRpnCalculator.cs" },
              { id: "errors", source: "avaloniarpncalculator/RpnCalc.Core/*Exception.cs" },
            ],
          },
        ],
      },
    ],
    chips: [".NET 8", "Avalonia 11", "xUnit"],
  },
};

/** The block pairs a diagram links, from its rows and from the links between its layers. */
export function architectureLinks(diagram: ArchitectureDiagram): [string, string][] {
  const pairs: [string, string][] = [];
  for (const layer of diagram.layers) {
    for (const row of layer.rows) {
      if (row.joint !== "none") {
        for (let i = 1; i < row.blocks.length; i++) pairs.push([row.blocks[i - 1].id, row.blocks[i].id]);
      }
      if (row.loop && row.blocks.length > 1) pairs.push([row.blocks[row.blocks.length - 1].id, row.blocks[0].id]);
    }
    for (const pair of layer.next?.pairs ?? []) pairs.push(pair);
  }
  return pairs;
}
