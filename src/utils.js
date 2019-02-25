const businessCards = [
  'businessCard',
  'businessCardClients',
  'businessCardEmployee',
  'businessCardFilal',
  'businessCardGallery',
  'businessCardServiceGallery',
  'businessCardEmployeeGallery',
  'businessCardService',
  'businessVisit',
  'employeeCard',
  'employeeFull',
  'employeeGallery'
];

export function isBusinessCard(routeName) {
  return businessCards.some(x => x === routeName);
}
