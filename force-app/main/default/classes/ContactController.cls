public with sharing class ContactController {
  
   @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String searchText) {
        return [
            SELECT Id, Name, Email, AppointmentDate__c
            FROM Contact
            WHERE Name LIKE : '%' + searchText + '%'
            OR Email LIKE : '%' + searchText + '%'
            WITH SECURITY_ENFORCED
            ORDER BY Name ASC
            LIMIT 4
        ];         
        }

   @AuraEnabled(cacheable=true)
    public static List<Contact> getBirthdays() {
        Date today = System.today();
        return [
            SELECT Id, Name, Birthdate, Email
            FROM Contact
            WHERE CALENDAR_MONTH(Birthdate) = :today.month()
            AND DAY_IN_MONTH(Birthdate) = :today.day()
            WITH SECURITY_ENFORCED
            LIMIT 50
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Absense__c> getAbsenses(String dateFilter) {
       Date today = System.today();
        Date startDate;
        Date endDate;

        // TODAY
        if (dateFilter == 'today') {
            startDate = today;
            endDate = today;
        }

        // THIS WEEK (based on org locale)
        else if (dateFilter == 'this_week') {
            startDate = today.toStartOfWeek();
            endDate = startDate.addDays(6);
        }

        // THIS MONTH (first day → last day)
        else if (dateFilter == 'this_month') {
            startDate = Date.newInstance(today.year(), today.month(), 1);
            endDate = startDate.addMonths(1).addDays(-1);
        }

        return [
            SELECT Id,
                   Name,
                   Absense_Date__c,
                   Contact__c,
                   Contact__r.Name
            FROM Absense__c
            WHERE Absense_Date__c >= :startDate
              AND Absense_Date__c <= :endDate
            WITH SECURITY_ENFORCED
            ORDER BY Absense_Date__c
            LIMIT 50
            
        ];
    }
}


     
  