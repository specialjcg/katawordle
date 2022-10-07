class Word {
    private word: string;
    private letters: Letter[] = [];

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


    private colorizedLetters: Map<Letter, Color>;

    constructor(word: Word, colorizedletters: Map<Letter, Color>) {
        super(word.getWord());
        this.colorizedLetters = colorizedletters


    }

    static build(word: Word, colorizedLetters: Map<Letter, Color>): ColorizedWord {
        return new ColorizedWord(word, colorizedLetters)
    }
    static colorizedWordFromProposal (answerWord: Word, proposalWord: Word): ColorizedWord  {
        let colorizedLetters = new Map<Letter, Color>();
        proposalWord.getLetters().forEach((letter,index) =>
            ColorizedWord.colorizeLetter(letter,index,answerWord,colorizedLetters))

        return ColorizedWord.build(proposalWord, colorizedLetters);

    };

    private static colorizeLetter = (letter: Letter, positionInsideWord: number, answerWord: Word, colorizedLetters: Map<Letter, Color>) => {
        if (ColorizedWord.isMatching(letter, answerWord, positionInsideWord)) {
            colorizedLetters.set(letter, 'GREEN')
        } else if (answerWord.contains(letter)) {
            ColorizedWord.handleMatchedBefore(answerWord, letter, positionInsideWord, colorizedLetters);
        } else {
            colorizedLetters.set(letter, 'GREY')
        }
    };

    private static handleMatchedBefore(answerWord: Word, letter: Letter, position: number, colorizedLetters: Map<Letter, Color>) {
        if (ColorizedWord.hasMatchedBefore(answerWord, letter, position)) {
            colorizedLetters.set(letter, 'GREY')
        } else {
            colorizedLetters.set(letter, 'ORANGE')
        }
    }

    private static isMatching = (letter: Letter, answerWord: Word, position: number) => letter.equals(answerWord.getLetters()[position]);

    private static  hasMatchedBefore = (answerWord: Word, letter: Letter, position: number): boolean => {
        for (const beforeLetter of answerWord.getLetters().slice(0,position)) {
            if (beforeLetter.equals(letter)) return true
        }
        return false;
    };

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


    firstLetter(): ColorizedLetter {
        const firstLetter = this.getLetter(0);
        return new ColorizedLetter(firstLetter, this.colorsAsarray()[0]);
    }

    secondLetter(): ColorizedLetter {
        const secondLetter = this.getLetter(1);
        return new ColorizedLetter(secondLetter, this.colorsAsarray()[1]);
    }

    thirdLetter(): ColorizedLetter {
        const thirdLetter = this.getLetter(2);
        return new ColorizedLetter(thirdLetter, this.colorsAsarray()[2]);
    }

    private getLetter(number: number): Letter {
        return this.getLetters()[number];
    }

    fourthLetter() : ColorizedLetter {
        const fourthLetter = this.getLetter(3);
        return new ColorizedLetter(fourthLetter, this.colorsAsarray()[3]);
    }

    lastLetter(): ColorizedLetter {
        const lastLetter = this.getLetter(4);
        return new ColorizedLetter(lastLetter, this.colorsAsarray()[4]);
    }
}






const firstLetterIsGreen = (colorizedWord: ColorizedWord): boolean => colorizedWord.firstLetter().isGreen();
const secondLetterIsOrange = (colorizedWord: ColorizedWord): boolean => colorizedWord.secondLetter().isOrange();

const thirdLetterIsGrey = (colorizedWord: ColorizedWord): boolean => colorizedWord.thirdLetter().isGrey();

const fourthLetterIsGrey=(colorizedWord: ColorizedWord) : boolean => colorizedWord.fourthLetter().isGrey();

const lastLetterIsGrey = (colorizedWord: ColorizedWord): boolean => colorizedWord.lastLetter().isGrey();

const thirdLetterIsOrange=(colorizedWord: ColorizedWord):boolean=> colorizedWord.thirdLetter().isOrange();


const lastLetterIsGreen = (colorizedWord: ColorizedWord): boolean => colorizedWord.lastLetter().isGreen();

describe('test wordle', function () {
    it('should return no matches and is grey', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("bbbbb");
        expect(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord).isGrey()).toBe(true);
    });
    it('should return all matche letter and not grey ', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("aaaaa");
        expect(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord).isGrey()).toBe(false);
    });
    it('should return one letter match and not grey ', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("abbbb");
        expect(firstLetterIsGreen(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord))).toBe(true);
    });
    it('should return one letter match and word not grey ', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("abbbb");
        expect(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord).isGrey()).toBe(false);
    });
    it('should return one letter match and word is green ', function () {
        const answerWord: Word = new Word("aaaaa");
        const proposalWord: Word = new Word("aaaaa");
        expect(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord).isGreen()).toBe(true);
    });
    it('should return second letter misplaced and orange ', function () {
        const answerWord: Word = new Word("abcde");
        const proposalWord: Word = new Word("acaaa");
        expect(secondLetterIsOrange(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord))).toBe(true);
    });
    it('should return third letter not match and is grey ', function () {
        const answerWord: Word = new Word("abcde");
        const proposalWord: Word = new Word("acaaa");
        expect(thirdLetterIsGrey(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord))).toBe(true);
    });
    it('should return fourth letter not match and is grey ', function () {
        const answerWord: Word = new Word("abcde");
        const proposalWord: Word = new Word("acaaa");
        expect(fourthLetterIsGrey(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord))).toBe(true);
    });
    it('should return third letter not match and is grey with two instances of a in answerWord', function () {
        const answerWord: Word = new Word("abcae");
        const proposalWord: Word = new Word("acaaa");
        expect(thirdLetterIsGrey(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord))).toBe(true);
    });
    it('should return last letter not match and is grey', function () {
        const answerWord: Word = new Word("abcae");
        const proposalWord: Word = new Word("acaaa");
        expect(lastLetterIsGrey(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord))).toBe(true);
    });
    it('should return third letter misplaced and is orange', function () {
        const answerWord: Word = new Word("abcae");
        const proposalWord: Word = new Word("abeaa");
        expect(thirdLetterIsOrange(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord))).toBe(true);
    });
    it('should return last letter is green', function () {
        const answerWord: Word = new Word("abcee");
        const proposalWord: Word = new Word("abece");
        expect(lastLetterIsGreen(ColorizedWord.colorizedWordFromProposal(answerWord, proposalWord))).toBe(true);
    });
    //todo refacto and lastletterGreen
});
