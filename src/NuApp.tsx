import { useState } from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  makeStyles,
  shorthands,
  tokens,
  useId,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

import './NuApp.css';
import FunctionList from './FuncList';

const useStyles = makeStyles({
  root: {
    ...shorthands.border('2px', 'solid', '#ccc'),
    ...shorthands.overflow('hidden'),

    display: 'flex',
    height: '480px',
    backgroundColor: '#fff',
  },

  content: {
    ...shorthands.flex(1),
    ...shorthands.padding('16px'),

    display: 'grid',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gridRowGap: tokens.spacingVerticalXXL,
    gridAutoRows: 'max-content',
  },

  field: {
    display: 'grid',
    gridRowGap: tokens.spacingVerticalS,
  },
});

export function NuApp() {
  const styles = useStyles();
  const [light, setLight] = useState(true);
  const [isFuncListVisible, setIsFuncListVisible] = useState(true);
  return (
    <FluentProvider theme={light ? webLightTheme : webDarkTheme}>
      <div className={styles.root}>
        <Drawer
          type="inline"
          separator
          open={isFuncListVisible}
          onOpenChange={(_: unknown, { open }: { open: boolean }) =>
            setIsFuncListVisible(open)
          }
        >
          <DrawerHeader>
            <DrawerHeaderTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => setIsFuncListVisible(false)}
                />
              }
            >
              Function List
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody>
            <div>a</div>
            <div>b</div>
            {/* <FunctionList /> */}
          </DrawerBody>
        </Drawer>
        <div>
          <h1>Getting started</h1>
          <Button appearance="primary" onClick={() => setLight((l) => !l)}>
            Theme is {light ? 'light' : 'dark'}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          <Button
            appearance="primary"
            onClick={() => setIsFuncListVisible((o) => !o)}
          >
            Toggle Function List
          </Button>
        </div>
      </div>
    </FluentProvider>
  );
}
