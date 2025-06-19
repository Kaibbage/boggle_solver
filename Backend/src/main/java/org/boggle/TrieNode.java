package org.boggle;

public class TrieNode {
    boolean end;
    TrieNode[] children;

    public TrieNode(){
        end = false;
        children = new TrieNode[26];
    }
}
