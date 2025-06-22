package org.boggle;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Dice {
    public List<List<Character>> allDice;

    public Dice(){
        allDice = new ArrayList<>();
        addDice();
    }

    public void addDice(){
        List<Character> d1 = new ArrayList<>(List.of('q', 'u', 'k', 'l', 'w', 'i'));
        List<Character> d2 = new ArrayList<>(List.of('p', 'i', 'e', 'c', 't', 's'));
        List<Character> d3 = new ArrayList<>(List.of('e', 't', 'i', 't', 'i', 'i'));
        List<Character> d4 = new ArrayList<>(List.of('o', 'n', 'h', 'h', 'l', 'd'));
        List<Character> d5 = new ArrayList<>(List.of('p', 'r', 'y', 'f', 's', 'i'));

        List<Character> d6 = new ArrayList<>(List.of('s', 's', 'n', 's', 'e', 'u'));
        List<Character> d7 = new ArrayList<>(List.of('o', 'r', 'r', 'v', 'g', 'w'));
        List<Character> d8 = new ArrayList<>(List.of('e', 'd', 'n', 'a', 'n', 'n'));
        List<Character> d9 = new ArrayList<>(List.of('a', 'e', 'n', 'm', 'g', 'n'));
        List<Character> d10 = new ArrayList<>(List.of('k', 'j', 'z', 'b', 'x', 'q'));

        List<Character> d11 = new ArrayList<>(List.of('t', 't', 'o', 'o', 'o', 'u'));
        List<Character> d12 = new ArrayList<>(List.of('r', 'a', 'a', 'a', 'f', 's'));
        List<Character> d13 = new ArrayList<>(List.of('s', 'c', 'n', 't', 'e', 'c'));
        List<Character> d14 = new ArrayList<>(List.of('g', 'e', 'm', 'a', 'e', 'u'));
        List<Character> d15 = new ArrayList<>(List.of('r', 'h', 'd', 'h', 'o', 'l'));

        List<Character> d16 = new ArrayList<>(List.of('s', 'i', 'a', 'a', 'r', 'f'));
        List<Character> d17 = new ArrayList<>(List.of('i', 'i', 't', 'c', 'l', 'e'));
        List<Character> d18 = new ArrayList<>(List.of('e', 'e', 'a', 'm', 'e', 'e'));
        List<Character> d19 = new ArrayList<>(List.of('h', 'l', 'd', 'o', 'r', 'n'));
        List<Character> d20 = new ArrayList<>(List.of('a', 'e', 'e', 'e', 'e', 'a'));

        List<Character> d21 = new ArrayList<>(List.of('t', 'i', 'e', 'c', 'l', 'p'));
        List<Character> d22 = new ArrayList<>(List.of('d', 'o', 'h', 'd', 'n', 't'));
        List<Character> d23 = new ArrayList<>(List.of('u', 'o', 'n', 'w', 'o', 't'));
        List<Character> d24 = new ArrayList<>(List.of('r', 'i', 'y', 'a', 's', 'f'));
        List<Character> d25 = new ArrayList<>(List.of('t', 't', 'm', 't', 'o', 'e'));

        allDice.add(d1);
        allDice.add(d2);
        allDice.add(d3);
        allDice.add(d4);
        allDice.add(d5);

        allDice.add(d6);
        allDice.add(d7);
        allDice.add(d8);
        allDice.add(d9);
        allDice.add(d10);

        allDice.add(d11);
        allDice.add(d12);
        allDice.add(d13);
        allDice.add(d14);
        allDice.add(d15);

        allDice.add(d16);
        allDice.add(d17);
        allDice.add(d18);
        allDice.add(d19);
        allDice.add(d20);

        allDice.add(d21);
        allDice.add(d22);
        allDice.add(d23);
        allDice.add(d24);
        allDice.add(d25);
    }

    public List<Character> getCharList(int n){
        List<List<Character>> dice = new ArrayList<>(allDice);
        List<Character> charList = new ArrayList<>();

        Collections.shuffle(dice);

        if(n == 4){
            for(int i = 24; i >= 16; i--) {
                dice.remove(i);
            }
        }
        else if(n > 5){
            for(int i = 25; i < n*n; i++){
                dice.add(getRandomDie());
            }
        }

        for(List<Character> die: dice){
            charList.add(getRandomCharFromDie(die));
        }

        return charList;
    }

    public List<Character> getRandomDie(){
        int index = (int) (Math.random() * 25);
        return allDice.get(index);
    }

    public Character getRandomCharFromDie(List<Character> die){
        int index = (int) (Math.random() * 6);
        return die.get(index);
    }
}
