import { links } from 'utils/links';
import { user } from 'utils/user';

import { getAdminNavItems } from './admin-items';
import { getInstructorNavItems } from './instructor-items';

const createNSBItem = (text, icon, href, activeType = 'starts', items=[]) => ({
  text,
  icon,
  href,
  items,
  activeType,
  value: `ct-nsb-${ text.toLowerCase().replace(' ', '-')}`
});

export const getDefaultNSBItems = () => {
  let nsbitems = [
    // homepage
    createNSBItem('Home', 'home', links.home(), 'exact'),
    createNSBItem('Search', 'search', links.search())
  ];

  if (user.isLoggedIn) {
    nsbitems.push(createNSBItem('History', 'history', links.history()));
    nsbitems.push(createNSBItem('Analytics', 'bar_chart', links.personalAnalytics()));
  }

  const isInstructor = user.isInstructor;
  const isAdmin = user.isAdmin;

  if (isInstructor || isAdmin) {
    nsbitems.push('breakline');
  }

  if (isInstructor) {
    let instItem = createNSBItem(
      'My Courses',
      'class',
      links.instructor(),
      'starts',
      getInstructorNavItems()
    );
    instItem.reloadOnPathnameChange = true;
    nsbitems.push(instItem);
  }

  if (isAdmin) {
    let adminItem = createNSBItem(
      'Admin', 
      'supervisor_account', 
      links.admin(), 
      'starts',
      getAdminNavItems()
    );
    adminItem.reloadOnPathnameChange = true;
    nsbitems.push(adminItem);
  }

  return nsbitems;
}