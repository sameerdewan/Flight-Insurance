import { Web3Context } from '../contexts/Web3';

module.exports = {
    withWeb3(Component) {
        return function contextComponent(props) {
            return (
                <Web3Context.Consumer>
                    {context => <Component {...{...props, ...context}} />}
                </Web3Context.Consumer>
            )
        }
    }
}
