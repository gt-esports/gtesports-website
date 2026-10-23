import { esportsApi } from './esportsApi';
import { createMarketingContactsApi } from './marketingContactsApi';

export const { fetchContacts, saveContact, deleteContact, importContacts } = createMarketingContactsApi(esportsApi);
