module.exports = {
    withContext(Component) {
        return function contextComponent(props) {
            return (
                <Context.Consumer>
                    {context => <Component {...{...props, ...context}} />}
                </Context.Consumer>
            )
        }
    }
}
