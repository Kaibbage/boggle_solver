package org.boggle;

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
            grid[r][c] = charString.charAt(0);
            index++;
        }

        return grid;
    }

}
