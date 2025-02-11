// const translations = {
//   en: {
//     lost: 'lost',
//     not_added: 'not added'
//   },
//   zh: {
//     lost: '失联',
//     not_added: '未添加'
//   }
// }


export type Friend = {
  id: number
  title?: string

  name: string
  url: string
  avatar: string
  description: string

  labels?: string[] // [lost, not added]

  state?: string // open | closed
}
import { RestIssues_i } from '@/types/github/issues';

const issue2friend = (issue: RestIssues_i): Friend | null => {
  try {
    const { number, title, body, labels: issue_labels, state } = issue;
    const nameMatch = body.match(/name: (.*)/);
    const urlMatch = body.match(/url: (.*)/);
    const avatarMatch = body.match(/avatar: (.*)/);
    const descriptionMatch = body.match(/desc: (.*)/);
    const filteredLabels = issue_labels
      .map((label: any) => label.name)
      .filter((name: string) => name === "lost" || name === "not added");

    return {
      id: number,
      name: nameMatch ? nameMatch[1] : title,
      url: urlMatch ? urlMatch[1] : '',
      avatar: avatarMatch ? avatarMatch[1] : '',
      description: descriptionMatch ? descriptionMatch[1] : '',
      labels: filteredLabels,
      state
    } as Friend
  } catch (error) {
    console.error('Error parsing issue:', error);
    return  {id: 0, name: '', url: '', avatar: '', description: '', labels: [], state: ''} as Friend
  }
}
const friend2issue = (friend: Friend, existingFriend?: Friend) => {
  const { id, title, name, url, avatar, description, labels, state } = friend;
  const body = `name: ${name || existingFriend?.name}\nurl: ${url || existingFriend?.url}\navatar: ${avatar || existingFriend?.avatar}\ndesc: ${description || existingFriend?.description}`
  return {
    number: id,
    title: title || name,
    body: body,
    labels: labels,
    state: state
  }
}

type FetchSearchParams = {
  // state: string , //'open' | 'closed' | 'all',
  [key: string]: string,
}
interface FetchOptions {
  searchParams?: FetchSearchParams
  method?: string
  body?: BodyInit | null
  issueNumber?: string
}
export const get_friends = async (fetch_options: FetchOptions) => {
  const { searchParams, method = 'GET', body, issueNumber } = fetch_options
  const url = await createIssueUrl(fetch_options)
  console.log(`app/api/friends/lib.ts: get_friends: url: ${url}`);
  const options: RequestInit = {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    let ret = data
    if (response.ok) {
      if (method === 'GET' && !issueNumber) {
        console.log('friends:list')
        ret = data.map((issue: RestIssues_i) => issue2friend(issue))
      } else {
        // 处理非 GET 请求的响应或 GET 请求单个对象的响应
        console.log('friends:item')
        ret = issue2friend(data)
      }
    }
    return ret
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error);
    throw error;
  }
}

// export const createIssueOptions = async (fetch_options: FetchOptions) => {

export const add_friend = async (fetch_options: FetchOptions) => {
  const { searchParams, body, issueNumber } = fetch_options
  const url = await createIssueUrl(fetch_options)

  const friend = JSON.parse(body as string) as Friend;
  if (!friend.name || !friend.url) {
    throw new Error('name and url are required fields');
  }

  const options: RequestInit = {
    method: "POST",
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(friend2issue(friend))
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    let ret = data
    if (response.ok) {
      ret = issue2friend(data)
    }
    return ret
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error);
    throw error;
  }
}

const createIssueUrl =  async (fetch_options: FetchOptions) => {
  const { searchParams, issueNumber } = fetch_options
  let url = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_FRIENDS_REPO}/issues`
  if (issueNumber) {
    url = `${url}/${issueNumber}`
  } else {
    const searchParamsString = new URLSearchParams(searchParams).toString()
    url = `${url}?${searchParamsString}`
  }
  return url
}