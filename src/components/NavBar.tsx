import React, { Component } from 'react';
import { Button, Footer, FooterTab, Icon, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

/**
 * Navigation bar component for main app landing page.
 * Contains buttons for invoices , customers and items list pages
 */
interface NavBarState { scene: number }

class NavBar extends Component<{}, NavBarState> {
    /**
     * Constructs a local state for navigation
     *
    /**
     * @param props - React component props
     */
    constructor(props: {}) {
        super(props);
        this.state = {
            scene: 1,
        };
    }

    render() {
        return (
            <Footer>
                <FooterTab>
                    <Button vertical
                        active={(this.state as { scene: number }).scene === 1}
                        onPress={() => {
                            Actions.invoices();
                            this.setState({ scene: 1 });
                        }}>
                        <Icon name="file-invoice-dollar" type={'FontAwesome5'} />
                        <Text>Invoice</Text>
                    </Button>
                    <Button vertical
                        active={(this.state as { scene: number }).scene === 2}
                        onPress={() => {
                            Actions.customers();
                            this.setState({ scene: 2 });
                        }}>
                        <Icon name="ios-people" />
                        <Text>Customers</Text>
                    </Button>
                    <Button vertical
                        active={(this.state as { scene: number }).scene === 3}
                        onPress={() => {
                            Actions.items();
                            this.setState({ scene: 3 });
                        }}>
                        <Icon active name="ios-barcode" />
                        <Text>Items</Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}

export default NavBar;
