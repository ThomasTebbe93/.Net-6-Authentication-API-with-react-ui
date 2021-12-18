import { Redirect, Route, RouteProps, useLocation } from "react-router";
import { authenticationService } from "../services/authenticationService";

export interface ProtectedRouteProps extends RouteProps {
    right?: string;
}

export default function PrivateRoute({
    right,
    children,
    ...rest
}: ProtectedRouteProps) {
    let location = useLocation();

    const currentUser = authenticationService.currentUserValue;

    if (
        !currentUser ||
        !currentUser.token ||
        (right && !currentUser?.rights?.includes(right))
    ) {
        return <Redirect to={{ pathname: "/login", state: location.state }} />;
    }

    return <Route {...rest} render={() => children} />;
}
