package org.boggle;

import org.boggle.BoggleApplication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

import static org.boggle.ParseUtils.getGridFromString;
import static org.boggle.ParseUtils.wordListToString;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:8081")  // Adjust the URL to your frontend's URL if necessary
public class BoggleController {

    public BoggleSolver boggleSolver;

//    private GraphExploreWebSocketHandler webSocketHandler;

    // Constructor injection of WebSocket handler
//    public GraphExploreController(GraphExploreWebSocketHandler webSocketHandler) {
//        this.webSocketHandler = webSocketHandler;
//        graphAlgorithms = new GraphAlgorithms(webSocketHandler);
//    }

    public BoggleController(){
        boggleSolver = new BoggleSolver();
    }

    public static class InputRequest {
        private String input;

        public String getInput() {
            return input;
        }

        public void setInput(String input) {
            this.input = input;
        }
    }


    @PostMapping("/solve-boggle-all-at-once")
    public String startSolvingDijkstra(@RequestBody InputRequest request) {
        String input = request.getInput();

        char[][] grid = getGridFromString(input);

        List<String> allBoggleWords = boggleSolver.getAllBoggleWords(grid, grid.length);

        String wordListString = wordListToString(allBoggleWords);

        return wordListString;
    }



//    @PostMapping("/start-solving-dijkstra")
//    public String startSolvingDijkstra(@RequestBody InputRequest request) {
//        String input = request.getInput();
//
//        int[][] grid = ParseUtils.getGridFromString(input);
//
//        new Thread(() -> {
//            try {
//                graphAlgorithms.dijkstra(grid);
//            } catch (InterruptedException e) {
//                throw new RuntimeException(e);
//            }
//        }).start();
//
//
//        return "Shortest Path solving started";
//    }



}
