import { LightningElement, track, wire} from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
export default class HelloWorld extends LightningElement {
    @track searchKey = '';
    @track contacts = [];
    @track selectedContacts = [];
    //recordLink;
    
    columns = [
        { 
          label: 'Name', fieldName: 'recordLink', type: 'url',
            typeAttributes: {
               label: { fieldName: 'Name' }, 
               target: '_blank'
            }
        },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'Update Calendar', type: 'button',         
            typeAttributes: {
            label: 'Select',
            name: 'select_contact',
            variant: 'brand'
        }

}
    ];

    handleChange(event){
        this.searchKey = event.target.value;
    }

     @wire(getContacts, { searchText : '$searchKey'  }) 
     wiredContacts({error, data}) {

        if(data){
                //this.contacts = data;
                this.contacts = data.map(c => {
                return {
                    ...c,
                    recordLink: '/' + c.Id
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
