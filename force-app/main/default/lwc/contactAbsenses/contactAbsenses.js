import { LightningElement, track, wire} from 'lwc';
import getAbsenses from '@salesforce/apex/ContactController.getAbsenses';
export default class ContactAbsenses extends LightningElement {
    @track absenses = [];
    @track error;

    @wire(getAbsenses)
    wiredAbsenses({ data, error }) {
        if (data) {
            this.absenses = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.absenses = [];
        }
    }
}