package org.boggle;

import org.boggle.BoggleApplication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

import static org.boggle.ParseUtils.*;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:8081")  // Adjust the URL to your frontend's URL if necessary
public class BoggleController {

    public BoggleSolver boggleSolver;
    public Dice dice;


    public BoggleController(){
        boggleSolver = new BoggleSolver();
        dice = new Dice();
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
    public String solveBoggleAllAtOnce(@RequestBody InputRequest request) {
        String input = request.getInput();

        char[][] grid = getGridFromString(input);

        List<WordAndPath> allBoggleWordPaths = boggleSolver.getAllBoggleWords(grid, grid.length);

        String wordPathListString = wordPathListToString(allBoggleWordPaths);

        return wordPathListString;
    }

    @PostMapping("/generate-random-boggle-grid")
    public String generateRandomBoggleGrid(@RequestBody InputRequest request) {
        String input = request.getInput();

        int n = Integer.parseInt(input);

        List<Character> charList = dice.getCharList(n);

        String chars = randomGridToString(charList);

        return chars;
    }






}
