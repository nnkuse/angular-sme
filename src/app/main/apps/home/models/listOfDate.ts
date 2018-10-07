export class ListOfDate {
  id: string;
  list_name: string;
  agency: string;
  in_date: string;

  constructor(listOfDate?) {
    listOfDate = listOfDate || {};
    this.id = listOfDate.id || '';
    this.list_name = listOfDate.list_name || '';
    this.agency = listOfDate.agency || '';
    this.in_date = listOfDate.in_date || '';
  }
}
