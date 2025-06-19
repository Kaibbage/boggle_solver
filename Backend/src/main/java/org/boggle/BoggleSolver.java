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
            addWordToTrie();
        }
    }

    public void addWordToTrie(){

    }
}
