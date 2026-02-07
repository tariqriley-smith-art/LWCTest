import { LightningElement, track, wire} from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
export default class HelloWorld extends LightningElement {
    @track searchKey = '';
    @track contacts = [];
    @track selectedContacts = [];
    //recordLink;
    
    columns = [
        { label: 'Name', fieldName: 'recordLink', type: 'url',
            typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}
        },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Appointment Date', fieldName: 'AppointmentDate__c' },
        { label: 'Change Appointment Date', type: 'url', fieldName: 'flowLink',         
            typeAttributes: {label: 'Update', target: '_blank'}
        }
    ];

    handleChange(event){
        this.searchKey = event.target.value;
    }

    @wire(getContacts, { searchText : '$searchKey'  }) 
     wiredContacts({error, data}) {
        if(data){
        this.contacts = data.map(c => {
            return {
                ...c,
                recordLink: '/' + c.Id,
                flowLink: '/flow/Contact_Update_Contact_Appointment_Date?recordId=' + c.Id

        };
    });

        }
        else if (error){
                this.contacts = undefined;
                console.error(error);
        }
     }

     
    handleRowSelection(event) {
        this.selectedContacts = event.detail.selectedRows;
        console.log('Selected:', JSON.stringify(this.selectedContacts));

    }

}