import { createContext, useEffect, useState, useMemo } from 'react';
import { IUser } from '../interfaces';
import { getCurrentUser } from '../api';

interface IUserContext {
    setUser: (user: IUser) => void;
    user: IUser;
}

export const UserContext = createContext({} as IUserContext);

export function Provider({children}: {children: JSX.Element}) {

    const [value, setValue] = useState<IUser>(null as unknown as IUser);

    useEffect(() => {
        getCurrentUser().then((user) => {
            setValue(user);
        });
    }, []);

    const data = useMemo(() => {
        return { setUser: setValue, user: value }
    }, [value, setValue]);

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    );
}
