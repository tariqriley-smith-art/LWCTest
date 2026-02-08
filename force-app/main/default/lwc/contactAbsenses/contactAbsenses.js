import { LightningElement, track, wire} from 'lwc';
import getAbsenses from '@salesforce/apex/ContactController.getAbsenses';
export default class ContactAbsenses extends LightningElement {
    @track absenses = [];
    @track error;
    @track selectedValue = 'today';

    @wire(getAbsenses, {dateFilter: '$selectedValue'})
    wiredAbsenses({ data, error }) {
    if (data) {
        this.selectedValue = this.selectedValue;
        this.absenses = data.map(a => ({
            ...a,
            absenseLink: '/' + a.Id,
            contactName: a.Contact__r.Name
        }));
    }
    else if (error) {
            this.error = error;
            this.absenses = [];
        }
      }

    get options() {
        return [
            { label: 'Today', value: 'today' },
            { label: 'This Week', value: 'this_week' },
            { label: 'This Month', value: 'this_month' }
        ];
    }

    handleFilterChange(event) {
        this.selectedValue = event.detail.value;
    }
}