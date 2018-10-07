export class Lists {
  id: string;
  list_name: string;
  agency: string;
  start_date: string;
  end_date: string;
  net_income: string;

  constructor(list?) {
    list = list || {};
    this.id = list.id || '';
    this.list_name = list.list_name || '';
    this.agency = list.agency || '';
    this.start_date = list.start_date || '';
    this.end_date = list.end_date || '';
    this.net_income = list.net_income || '';
  }
}
