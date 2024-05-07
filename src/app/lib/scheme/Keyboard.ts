export default class Keyboard {
    wentDownKeys: string[] = [];
    wentUpKeys: string[] = [];
    isDownKeys: string[] = [];

    constructor () {
        document.onkeydown = (e) => {
            if (!this.isDownKeys.includes(e.key)) {
                this.wentDownKeys.push(e.key);
                this.isDownKeys.push(e.key);
            }
        };

        document.onkeyup = (e) => {
            if (this.isDownKeys.includes(e.key)) {
                this.wentUpKeys.push(e.key);
                this.isDownKeys.splice(this.isDownKeys.findIndex((el) => el === e.key), 1);
            }
        }
    }

    makeKeyboardUpdateable = (func: Function) => {
        return () => {
            func();
            this.wentDownKeys.length = 0;
            this.wentUpKeys.length = 0;
        }
    }

    getString(filter: string[] = []) {
        let keys = this.wentDownKeys;
        if (filter.length !== 0) {
            keys = this.wentDownKeys.filter((val) => filter.includes(val));
        }
        return keys.join(); 
    }

    wentDown(key: string, filter: string[] = []) {
        let keys = this.wentDownKeys;
        if (filter.length !== 0) {
            keys = this.wentDownKeys.filter((val) => filter.includes(val));
        }
        return this.wentDownKeys.includes(key);
    }

    isDown(key: string, filter: string[] = []) {
        let keys = this.isDownKeys;
        if (filter.length !== 0) {
            keys = this.isDownKeys.filter((val) => filter.includes(val));
        }
        return this.isDownKeys.includes(key);
    }

    wentUp(key: string, filter: string[] = []) {
        let keys = this.wentUpKeys;
        if (filter.length !== 0) {
            keys = this.wentUpKeys.filter((val) => filter.includes(val));
        }
        return this.wentUpKeys.includes(key);
    }
}