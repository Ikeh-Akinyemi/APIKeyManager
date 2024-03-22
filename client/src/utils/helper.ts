interface AccessToken {
  token: string | undefined;
  expiryTime: string | undefined;
}

// saveTokenToCookie saves the accessToken and expiryTime to a cookie
export const saveAuthTokenToCookie = ({ token, expiryTime }: AccessToken): void => {
  document.cookie = `accessToken=${token};expires=${expiryTime && new Date(expiryTime).toUTCString()};path=/`;
};

// getCookie retrieves a cookie by name
export function getAuthCookie(name: string = "accessToken"): string {
  const cookieValue = `; ${document.cookie}`;
  const cookieParts = cookieValue.split(`; ${name}=`);
  
  if (cookieParts.length === 2) {
    const [token] = cookieParts.pop()?.split(';') ?? [""];
    return token;
  }
  
  return "";
}