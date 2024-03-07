import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'components/loader/Loadable';
import PrivateRoute from './PrivateRoute';

const Profile = Loadable(lazy(() => import('views/profile')));
const Contacts = Loadable(lazy(() => import('views/social/contacts')));
const Messenger = Loadable(lazy(() => import('views/social/messenger')));
const Pokegene = Loadable(lazy(() => import('views/spend/pokegene')));

const MainRoutes = {
    path: '/',
    element: <PrivateRoute />,
    children: [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    path: '',
                    element: <Contacts />
                },
                {
                    path: 'profile',
                    element: <Profile />
                },
                {
                    path: 'messenger',
                    element: <Messenger />
                },
                {
                    path: 'pokegene',
                    element: <Pokegene />
                }
            ]
        }
    ]
};

export default MainRoutes;
