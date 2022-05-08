import './App.css'
import { useEffect, useState, useRef } from 'react';
import UserItem from './components/UserItem';

const endpoint = "https://api.github.com/search/users?q=";

let isLimitExceeded = false;

function App() {
  const [inpValue, setInpValue] = useState("")
  const [usersList, setUsersList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isExceeded, setIsExceeded] = useState(false)
  const inputEl = useRef(null);

  useEffect(() => {
    if (inpValue && !isLimitExceeded) {
      getSearchResults(inpValue)
    } else {
      setIsLoaded(false)
    }
  }, [inpValue])
  
  const getSearchResults = (value) => {
    // Regex for whitespaces
    const regex = /^(?!\s*$).+/;
    const checkInp = regex.test(inpValue);

    if (!checkInp) return
    fetch(`${endpoint}${value}`)
    .then(res => res.json())
    .then(data => {
      if (data.items.length) {
        setUsersList(data.items)
        setIsLoaded(true)
      } else {
        setIsLoaded(false)
      }
    })
    .catch(() => {
      if (!isLimitExceeded) {
        limitExceeded()
      }
    })
  }
  
  const limitExceeded = () => {
    isLimitExceeded = true;
    setIsLoaded(false)
    setIsExceeded(true)
    
    let timer = 60;
    let tempinpValue = inpValue;
    
    const setTimer = setInterval(() => {
      setInpValue(`Please wait ${timer} seconds..`)
      
      // When time out
      if (timer === 0) {
        isLimitExceeded = false;
        setInpValue(tempinpValue)
        clearInterval(setTimer)
        setIsExceeded(false)
        setTimeout(() => {
          inputEl.current.focus();  
        }, 1);
      }

      timer--;
    }, 1000);
  }

  const jumpToFirstUserProfile = e => {
    e.preventDefault()
    
    if (!isLoaded) return 
    window.open(usersList[0].html_url, '_blank').focus();
  }
  
  return (
    <div className="App">
      <header>
        <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" className="octicon octicon-mark-github v-align-middle">
          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <form onSubmit={jumpToFirstUserProfile}>
          <input 
            className={isLoaded ? "active-inp" : ""}
            disabled={isExceeded}
            ref={inputEl}
            placeholder='Search or jump to…' 
            value={inpValue}
            onChange={e => {
              setInpValue(e.target.value)
            }}
          />
          {isLoaded && (
            <div className='users-list'>
                {usersList.map((user, idx) => {
                  if (idx < 10) {
                    return (
                      <UserItem 
                        key={user.id}
                        img={user.avatar_url}
                        userName={user.login}
                        url={user.html_url}
                      />
                    )
                  }
                })}
            </div>
          )}
        </form>
      </header>
    </div>
  );
}

export default App;
