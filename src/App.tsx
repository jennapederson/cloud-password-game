import { Heading, Text, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Game from "./components/game/GameComponent";
import { ThemeProvider } from '@aws-amplify/ui-react';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <main>
        <Heading
          width='60vw'
          level={1}
          variation="primary"
        >
          Cloud Password
        </Heading>
        <View as="section">
          <Text
            variation="primary"
            as="p"
            lineHeight="1.5em"
            fontWeight={400}
            fontSize="1em"
            fontStyle="normal"
            textDecoration="none"
            width="60vw"
          >
            Guess the password based on the one-word clue. Passwords are based on cloud terminology and AWS concepts. Make sure to try the short or full service name, including the prefix, Amazon or AWS. Guesses are case-insentitive.
          </Text>
          <Game />
        </View>
      </main>
    </ThemeProvider>
  );
}

export default App;
