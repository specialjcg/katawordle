class Word {
    private word: string;
    private letters: Letter[] = [];
    private colors: Color[] = []

    constructor(word: string) {
        this.word = word;
        for (let i = 0; i < this.word.length; i++) {
            this.letters.push(Letter.build(this.word.charAt(i)));
        }
    }

    getWord(): string {
        return this.word;
    }

    getLetters(): Letter[] {
        return this.letters;
    }

    equals(proposalWord: Word): boolean {

        return this.word === proposalWord.word;
    }

    contains(letter: Letter) {
        return this.word.includes(letter.getLetter());
    }
}

class Letter {
    private letter: string;

    constructor(letter: string) {
        this.letter = letter;
    }

    static build(letter: string) {
        if (letter.length === 1) return new Letter(letter);
        throw new Error();
    }

    getLetter() {
        return this.letter
    }


    equals(otherLetter: Letter) {
        return this.letter === otherLetter.letter;
    }


}

type Color = 'GREEN' | 'ORANGE' | 'GREY'


class ColorizedLetter {
    private letter: Letter;
    private color: Color

    constructor(letter: Letter, color: Color) {
        this.letter = letter;
        this.color = color;
    }

    getLetter(): Letter {
        return this.letter;
    }

    getColor(): Color {
        return this.color;
    }

    isGreen() {
        return this.color === 'GREEN';
    }

    isOrange() {
        return this.color === 'ORANGE';
    }

    isGrey() {
        return this.color === 'GREY';
    }
}

class ColorizedWord extends Word {


    private grey: boolean;
    private colorizedLetters: Map<Letter, Color>;

    constructor(word: Word, colorizedletters: Map<Letter, Color>) {
        super(word.getWord());
        this.colorizedLetters = colorizedletters


    }

    static build(word: Word, colorizedLetters: Map<Letter, Color>): ColorizedWord {
        return new ColorizedWord(word, colorizedLetters)
    }

    colorsAsarray(): Color[] {

        return Array.from(this.colorizedLetters.entries()).map(letter => letter[1])
    }

    isGrey(): boolean {
        let isGrey = true
        this.colorizedLetters.forEach((color: Color) => {
            if (color !== 'GREY') isGrey = false
        });
        return isGrey;

    }

    isGreen() {
        let isGreen = true
        this.colorizedLetters.forEach((color: Color) => {
            if (color !== 'GREEN') isGreen = false
        });
        return isGreen;
    }


    //todo matching letters also seen as misplaced
    firstLetter(): ColorizedLetter {
        const firstLetter = this.getLetter(0);
        return new ColorizedLetter(firstLetter, this.colorsAsarray()[0]);
    }

    secondLetter(): ColorizedLetter {
        const secondLetter = this.getLetter(1);
        return new ColorizedLetter(secondLetter, this.colorsAsarray()[1]);
    }

    private getLetter(number: number): Letter {
        return this.getLetters()[number];
    }

}


const colorizeLetter = (letter: Letter, i: number, answerWord: Word, colorizedLetters: Map<Letter, Color>) => {
    if (letter.equals(answerWord.getLetters()[i])) {
        colorizedLetters.set(letter, 'GREEN')
    } else if (answerWord.contains(letter)) {
        colorizedLetters.set(letter, 'ORANGE')
    } else {
        colorizedLetters.set(letter, 'GREY')
    }
};

const coloriseWord = (answerWord: Word, proposalWord: Word): ColorizedWord => {
    let colorizedLetters = new Map<Letter, Color>();
    for (let i = 0; i < proposalWord.getWord().length; i++) {
        colorizeLetter(proposalWord.getLetters()[i], i, answerWord, colorizedLetters);
    }

    return ColorizedWord.build(proposalWord, colorizedLetters);

};

const firstLetterIsGreen = (colorizedWord: ColorizedWord): boolean => colorizedWord.firstLetter().isGreen();
const secondLetterIsOrange = (colorizedWord: ColorizedWord): boolean => colorizedWord.secondLetter().isOrange();

describe('test wordle', function () {
    it('should return no matches and is grey', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("bbbbb");
        expect(coloriseWord(answerWord, proposalWord).isGrey()).toBe(true);
    });
    it('should return all matche letter and not grey ', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("aaaaa");
        expect(coloriseWord(answerWord, proposalWord).isGrey()).toBe(false);
    });
    it('should return one letter match and not grey ', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("abbbb");
        expect(firstLetterIsGreen(coloriseWord(answerWord, proposalWord))).toBe(true);
    });
    it('should return one letter match and word not grey ', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("abbbb");
        expect(coloriseWord(answerWord, proposalWord).isGrey()).toBe(false);
    });
    it('should return one letter match and word is green ', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("aaaaa");
        expect(coloriseWord(answerWord, proposalWord).isGreen()).toBe(true);
    });
    it('should return second letter misplaced and orange ', function () {
        const answerWord: Word = new Word("abcde");
        const proposalWord: Word = new Word("acaaa");
        expect(secondLetterIsOrange(coloriseWord(answerWord, proposalWord))).toBe(true);
    });
});
