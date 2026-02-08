import getContacts from '@salesforce/apex/ContactController.getContacts';
import {NavigationMixin} from 'lightning/navigation';
import {LightningElement, track, wire} from 'lwc';

export default class HelloWorld extends NavigationMixin
(LightningElement) {
  @track searchKey = '';
  @track contacts = [];
  @track selectedContacts = [];
  @track showFlowModal = false;
  @track flowInputVariables = [];
  @track selectedContactId;

  columns = [
    {
      label: 'Name',
      fieldName: 'recordLink',
      type: 'url',
      typeAttributes: {label: {fieldName: 'Name'}, target: '_blank'}
    },
    {label: 'Email', fieldName: 'Email'},
    {label: 'Appointment Date', fieldName: 'AppointmentDate__c'}, {
      type: 'button',
      typeAttributes: {label: 'Update', name: 'open_modal', variant: 'brand'}
    }
  ];

  handleChange(event) {
    this.searchKey = event.target.value;
  }

  @wire(getContacts, {searchText: '$searchKey'})
  wiredContacts({error, data}) {
    if (data) {
      this.contacts = data.map(c => {
        return {
          ...c,
          recordLink: '/' + c.Id,
          flowLink:
              '/flow/Contact_Update_Contact_Appointment_Date?recordId=' + c.Id
        };
      });

    } else if (error) {
      this.contacts = undefined;
      console.error(error);
    }
  }

  handleRowSelection(event) {
    const selected = event.detail.selectedRows;
    this.selectedContactId = selected.length === 1 ? selected[0].Id : null;
    console.log(this.selectedContactId);
  }

  openEmailComposer() {
    if (!this.selectedContactId) {
      alert('Please select a contact first.');
      return;
    }

    else
      this[NavigationMixin.Navigate]({
        type: 'standard__quickAction',
        attributes: {apiName: 'Global.SendEmail'},
        state: {recordId: this.selectedContactId}
      });
  }

  openCreateQuickAction() {
    const contactId = this.selectedContactId;
    console.log('contactID: ' + contactId);
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {objectApiName: 'Absense__c', actionName: 'new'},
      state: {defaultFieldValues: `Contact__c=${contactId}`}
    });
  }

  createCase() {
    const contactId = this.selectedContactId;
    console.log('contactID: ' + contactId);
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {objectApiName: 'Case', actionName: 'new'},
      state: {defaultFieldValues: `ContactId=${contactId}`}
    });
  }

  handleRowAction(event) {
    const action = event.detail.action.name;
    const row = event.detail.row;

    if (action === 'open_modal') {
      this.openFlowModal(row.Id);  // ← your modal function
    }
  }

  openFlowModal(contactId) {
    this.flowInputVariables = [{
      name: 'recordId',
      // must match your Flow input variable
      type: 'String',
      value: contactId  // hard-code a Contact Id just to test
    }];
    this.showFlowModal = true;
  }

  closeFlowModal() {
    this.showFlowModal = false;
  }

  handleFlowStatusChange(event) {
    const status = event.detail.status;
    if (status === 'FINISHED' || status === 'FINISHED_SCREEN') {
      this.showFlowModal = false;
      window.location.reload();
    } else if (status === 'ERROR') {
      this.showFlowModal = false;
      console.error(event.detail.errors);
    }
  }
}