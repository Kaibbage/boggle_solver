package org.boggle;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static org.boggle.Constants.MIN_WORD_SIZE;
import static org.boggle.Constants.directions;

public class BoggleSolver {
    public TrieNode head;

    public BoggleSolver(){
        head = new TrieNode();
    }

    public void setUpWordsAndPrefixTree(){
        List<String> allWords = loadWords("textfiles/words_lowercase.txt");
        buildTrie(allWords);
    }

    public List<String> loadWords(String filename) {
        List<String> allWordList = new ArrayList<>();

        try {
            Resource resource = new ClassPathResource(filename);
            try (InputStream inputStream = resource.getInputStream();
                 Scanner scanner = new Scanner(inputStream)) {

                while (scanner.hasNext()) {
                    allWordList.add(scanner.next().toLowerCase());
                }
                System.out.println("Dictionary loaded successfully! Words: " + allWordList.size());
            }
        } catch (IOException e) {
            System.err.println("Error reading the dictionary file: " + e.getMessage());
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

    public List<WordAndPath> getAllBoggleWords(char[][] grid, int n){
        List<WordAndPath> boggleWordPaths = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean[][] seen = new boolean[n][n];
        HashSet<String> usedWords = new HashSet<>();
        List<int[]> path = new ArrayList<>();

        for(int r = 0; r < n; r++){
            for(int c = 0; c < n; c++){
                dfs(grid, head, sb, path, boggleWordPaths, seen, usedWords, r, c, n);
            }
        }
        //sorted by length (biggest to smallest), if same length then sorted alphabetically
        Collections.sort(boggleWordPaths, (a, b) -> {
            if(a.word.length() != b.word.length()){
                return Integer.compare(b.word.length(), a.word.length());
            }
            else{
                return a.word.compareTo(b.word);
            }

        });
        return boggleWordPaths;
    }

    public void dfs(char[][] grid, TrieNode curr, StringBuilder sb, List<int[]> path, List<WordAndPath> boggleWordPaths, boolean[][] seen, HashSet<String> usedWords, int r, int c, int n){
        if(seen[r][c] || curr.children[grid[r][c] - 'a'] == null){
            return;
        }

        seen[r][c] = true;
        sb.append(grid[r][c]);
        path.add(new int[]{r, c});
        curr = curr.children[grid[r][c] - 'a'];

        String wordString = sb.toString();
        if(curr.end && sb.length() >= MIN_WORD_SIZE && !usedWords.contains(wordString)){
            boggleWordPaths.add(new WordAndPath(wordString, path));
            usedWords.add(wordString);
        }

        for(int[] direction: directions){
            int nr = r + direction[0];
            int nc = c + direction[1];

            if(nr >= 0 && nr < n && nc >= 0 && nc < n){
                dfs(grid, curr, sb, path, boggleWordPaths, seen, usedWords, nr, nc, n);
            }
        }

        sb.deleteCharAt(sb.length()-1);
        path.remove(path.size()-1);
        seen[r][c] = false;
    }
}
