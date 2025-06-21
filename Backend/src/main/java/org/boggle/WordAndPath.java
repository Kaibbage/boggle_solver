package org.boggle;

import java.util.ArrayList;
import java.util.List;

public class WordAndPath {
    public String word;
    public List<int[]> path; //0 is r, 1 is c

    public WordAndPath(String word, List<int[]> path){
        this.word = word;
        this.path = new ArrayList<>(path);
    }
}
