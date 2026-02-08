import { LightningElement, wire, track} from 'lwc';
import getBirthdays from '@salesforce/apex/ContactController.getBirthdays';
export default class ContactBirthdays extends LightningElement {
    @track birthdays = [];
    @track error;

    @wire(getBirthdays)
    wiredBirthdays({ data, error }) {
        if (data) {
            this.birthdays = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.birthdays = [];
        }
    }



}