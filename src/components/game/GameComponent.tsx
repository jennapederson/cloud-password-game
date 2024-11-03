import { ChangeEvent, useState, useEffect } from "react";
import { Button, Flex, Loader, TextField, View } from "@aws-amplify/ui-react";
import Guess from "./Guess";
import Clue from "./Clue";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import "./game.css"

const client = generateClient<Schema>();

const firstMessagePrompt = `Act like you are an expert AWS and cloud word game show host who generates a secret word and one-word clues to guess that word. The user will only respond with a guess.

Follow the instructions when responding.
Instructions:
- The secret word should be 1-4 words long
- The secret word should be based on AWS service names
- Do NOT obfuscate the secret word in the output
- The clues you generate will represent the secret word
- The clues MUST be only one word long
- The clues should start out difficult and get increasingly easier over time
- You MUST ONLY share one clue at a time
- ALWAYS generate a new, unique clue
- NEVER generate a clue that is one of the past guesses
- Generate a clue during every interaction
- You MUST answer in JSON format only
- DO NOT use any other format while answering the question
- DO NOT include any additional explanation or information in the JSON output or after the JSON output

Please follow the output schema as shared below.
Output Schema:
{
  “word”: "the secret word to guess",
  “clue”: "clue1"
}

Example:
{
  “word”: “AWS”,
  “clue”: “cloud"
}

Generate the secret word and the first clue.
`;

export default function ChatComponent() {
  const [conversation, setConversation] = useState<{ role: string, content: { text: string }[] }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [localConversation, setLocalConversation] = useState<string[]>([]);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setInputValue(e.target.value);
  };

  const initializeGame = async () => {
    // get password and clue
    setFirstMessage();
  }
  useEffect(() => {

    const fetchChatResponse = async () => {
      setInputValue('');
      setIsLoading(true);

      const { data, errors } = await client.queries.generateChatResponse({
        conversation: JSON.stringify(conversation),
      });

      if (!errors && data) {
        const parsedData = JSON.parse(data);
        const output = JSON.parse(parsedData.content[0].text);

        setConversation(prevConversation => [...prevConversation, JSON.parse(data)]);
        setPassword(output.word);
        console.log('password: ', output.word);
        setLocalConversation(prevLocalConversation => [...prevLocalConversation, output.clue]);
      } else {
        setError(errors?.[0].message || "An unknown error occurred.")
        console.error("errors", errors);
      }
      setIsLoading(false);
    }

    // only fetch the response if there is a conversation and it ends with a user role message
    if (conversation.length > 0 && conversation[conversation.length - 1].role === "user") {
      fetchChatResponse();
    }

  }, [conversation]);

  const setNewGuessMessage = async () => {
    if (password.toLowerCase() === inputValue.toLowerCase()) {
      // correct guess!
      console.log('yay!')
      setScore(score + 1);
      setLocalConversation([]);
    } else {
      setLocalConversation(prevLocalConversation => [...prevLocalConversation, inputValue]);
      // get a new clue
      setNewClueMessage();
    }
  }

  const setNewClueMessage = async () => {
    const newClueMessagePrompt = `My guess is: ${inputValue}

      Generate the next clue. DO NOT change the secret word. DO NOT use any of the past clues.`;

    const newClueMessage = { role: "user", content: [{ text: newClueMessagePrompt }] };
    setConversation(prevConversation => [...prevConversation, newClueMessage]);
  };

  const setFirstMessage = async () => {
    const firstMessage = { role: "user", content: [{ text: firstMessagePrompt }] };
    setConversation(prevConversation => [...prevConversation, firstMessage]);
    setLocalConversation(prevLocalConversation => [...prevLocalConversation, "Requesting a clue..."]);
  };

  return (
    <View width="60vw">
      { password && localConversation.length === 0 ? (
        <h2>Yay! You guessed the right password: {password}. Do you want to try again?</h2>
      ) : <div></div> }
      { !password || localConversation.length === 0 ? (
          <div>
            <p>Score: {score}</p>
            <Button onClick={initializeGame}>Play game</Button>
          </div>
        ) :
        <Flex direction="column" wrap="wrap" justifyContent="space-between">
          {localConversation.map((item, i) =>
           i % 2 !== 0 ? (
            <Clue text={item} key={i} />
          ) : (
            <Guess text={item} key={i} />
          ))}
          {isLoading ? (<Loader />) : (<div></div>)}
          <TextField label="What is your first guess?"
            name="prompt"
            value={inputValue}
            onChange={handleInputChange}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                setNewGuessMessage();
              }
            }}
            labelHidden={true}
            hasError={error !== ""}
            errorMessage={error}
            width="60vw"
            outerEndComponent={<Button onClick={setNewGuessMessage}>Submit guess</Button>} />
        </Flex>
      }
    </View>
  )
}