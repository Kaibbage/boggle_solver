package org.boggle;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;

import static org.boggle.Constants.MIN_WORD_SIZE;
import static org.boggle.Constants.directions;

public class BoggleSolver {
    public TrieNode head;
    //public HashSet<String> foundBefore; this should be local, not an attribute


    public BoggleSolver(){
        head = new TrieNode();
        List<String> allWords = loadWords("textfiles/words_alpha.txt");
        buildTrie(allWords);
    }

    public List<String> loadWords(String filename){
        List<String> allWordList = new ArrayList<>();
        try {
            // Get the file from the classpath (resources folder)
            Resource resource = new ClassPathResource(filename);
            File file = resource.getFile();  // Get the file from the classpath

            // Read the file content
            try (Scanner scanner = new Scanner(file)) {
                while (scanner.hasNext()) {
                    allWordList.add(scanner.next().toLowerCase());
                }
                System.out.println("Dictionary loaded successfully! Words: " + allWordList.size());
            }
        } catch (FileNotFoundException e) {
            System.err.println("Error: Dictionary file not found!");
        } catch (IOException e) {
            System.err.println("Error reading the file: " + e.getMessage());
        }

        return allWordList;
    }



    public void buildTrie(List<String> allWords){
        for(String word: allWords){
            addWordToTrie(word);
        }
    }

    public void addWordToTrie(String word){
        TrieNode curr = head;
        for(char c: word.toCharArray()){
            int index = c - 'a';
            if(curr.children[index] == null){
                curr.children[index] = new TrieNode();
            }
            curr = curr.children[index];
        }
        curr.end = true;
    }

    public List<String> getAllBoggleWords(char[][] grid, int n){
        List<String> boggleWords = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean[][] seen = new boolean[n][n];
        HashSet<String> usedWords = new HashSet<>();

        for(int r = 0; r < n; r++){
            for(int c = 0; c < n; c++){
                dfs(grid, head, sb, boggleWords, seen, usedWords, r, c, n);
            }
        }
        return boggleWords;
    }

    public void dfs(char[][] grid, TrieNode curr, StringBuilder sb, List<String> boggleWords, boolean[][] seen, HashSet<String> usedWords, int r, int c, int n){
        if(seen[r][c] || curr.children[grid[r][c] - 'a'] == null){
            return;
        }

        seen[r][c] = true;
        sb.append(grid[r][c]);
        curr = curr.children[grid[r][c] - 'a'];

        String wordString = sb.toString();
        if(curr.end && sb.length() >= MIN_WORD_SIZE && !usedWords.contains(wordString)){
            boggleWords.add(wordString);
            usedWords.add(wordString);
        }

        for(int[] direction: directions){
            int nr = r + direction[0];
            int nc = c + direction[1];

            if(nr >= 0 && nr < n && nc >= 0 && nc < n){
                dfs(grid, curr, sb, boggleWords, seen, nr, nc, n);
            }
        }

        sb.deleteCharAt(sb.length()-1);
        seen[r][c] = false;
    }
}
