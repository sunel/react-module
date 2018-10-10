import React from 'react'
import { Module } from 'react-module';
import { fromJS } from 'immutable';
import App from '../../App';
import Home from './components/home';

class AppModule extends Module {

    get notFound() {
        return () => (
            <div>Simple 404</div>
        )
    }

    get reducer() {
        return (reducer) => {         
            const initialState = fromJS({
                loading: false,
                error: false,
                currentUser: false,
            });
            
            const appReducer = (state = initialState, action) => {
                return state;
            }

            reducer.add('app', appReducer);
        }
    }

    get sagas() {
        return (saga) => {
           
        }
    }

    get routes() {
        return (router) => {
            router.add('/', (params) => {
                return <Home />
            }, 'home')
        }
    }

    render() {
        return (
            <App />
        )
    }
}

export default AppModule;
