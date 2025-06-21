package org.boggle;

import java.util.List;

public class ParseUtils {
    public static char[][] getGridFromString(String stringGrid){
        String[] splitString = stringGrid.split("::");
        int n = Integer.parseInt(splitString[0]);
        String charSpaces = splitString[1];
        String[] charsAsString = charSpaces.split(" ");

        int index = 0;
        char[][] grid = new char[n][n];

        for(String charString: charsAsString){
            int r = index/n;
            int c = index%n;
            grid[r][c] = charString.toLowerCase().charAt(0);
            index++;
        }

        return grid;
    }

    public static String wordPathListToString(List<WordAndPath> wordList){
        String wordString = wordsToString(wordList);
        String pathString = pathsToString(wordList);

        return wordString + "::" + pathString;
    }

    public static String wordsToString(List<WordAndPath> wordList){
        StringBuilder sb = new StringBuilder();
        for(WordAndPath wordAndPath: wordList){
            sb.append(wordAndPath.word + " ");
        }
        sb.deleteCharAt(sb.length()-1);

        return sb.toString();
    }

    public static String pathsToString(List<WordAndPath> wordList){
        StringBuilder sb = new StringBuilder();
        for(WordAndPath wordAndPath: wordList){
            for(int[] pos: wordAndPath.path){
                sb.append(pos[0] + " " + pos[1] + "|");
            }
            sb.deleteCharAt(sb.length()-1);

            sb.append("$");
        }
        sb.deleteCharAt(sb.length()-1);

        return sb.toString();
    }

}
