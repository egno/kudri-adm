const businessCards = [
  'businessCard',
  'businessCardClient',
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
]

export function isBusinessRoute (routeName) {
  return businessCards.some(x => x === routeName)
}
