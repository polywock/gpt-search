## Advanced search for searching chat history.

### Flags 
**+dalle**: Filters for chats that used DALL-E.

**+python**: Filters for chats that used data analysis.  

**+browse**: Filters for chats that used web browsing.   

**+gizmo**: Filters for chats that used a custom GPT.  

**+gizmos**: Filters for chats that used multiple GPTs.   

**+gpt4**: Filter for chats that used GPT-4. 

**+archived**: Filter for archived chats. 

Adding a minus sign (-) before any of these flags, e.g., -dalle, filters out chats that used the specified tool or feature.

#### Example  
Search for chats with "spatula" that used DALL-E, but not a custom GPT. 
```text
spatula +dalle -gizmo  
```

Search for hammer, but in archives. 
```text
hammer +archived 
```

### Other Flags
**+turns \<num\>**: Filter for chats with more than \<num\> messages.   

**-turns \<num\>**: Filter for chats with less than \<num\> messages. 

#### Example  
Search for long chats with word "docker".
```text
docker +turns 20
```

Search for short chats with word ketchup. 
```text
ketchup -turns 5 
```


### Date Flags:
**+c** YYYY/MM/DD: Filters for chats created after the specified date.  

**-c** YYYY/MM/DD: Filters for chats created before the specified date.  

**+u** YYYY/MM/DD: Filters for chats updated after the specified date.  

**-u** YYYY/MM/DD: Filters for chats updated before the specified date.  

#### Example  
Search for chats with "javascript" created in 2023. 
```text
javascript +c 2023/01/01 -c 2024/01/01 
```

### Source flags 
**+title**: Check matches only from chat's title.  

**+body**: Check matches only from chat's body. You can also specify **+ast** to only include ChatGPT's replies, and **+user** to only include your replies.    

+**gpt**: Search only GPT titles. If you just installed GPT Search, this might not work as no GPTs have been cached. 

Using these flags with a minus sign (-) will exclude them them instead. 

Search for chats with "spatula" but exclude ChatGPT's replies. 
```text
spatula -ast  
```

Search for chats with "africa" in title. 

```
+title africa 
```

Search Consensus gpt. 

```
+gpt consensus 
```

### Search chats by custom GPT.

Find all chats that used a specific GPT. This feature might not work if you recently installed GPT Search as no GPTs might be cached yet. 
```
+g write for me 
```

Find all chats that used a specific GPT created before a specific date.
```
+g write for me -c 2024/1/31
```


### Exclude keywords  
You can exclude keywords by including a minus sign. 

Search for chats that contain "rabbit", but not "lion".

```
rabbit -lion 
```

### Chaining
You can filter search results by another query with the && operator. 

Search for chats with "king" in title and "troll" in the body. 
```text
+title king && +body troll
```


Search for chats that used Consensus GPT, but only those that have 'troll' in the title. 
```text
+g consensus && +title troll
```
