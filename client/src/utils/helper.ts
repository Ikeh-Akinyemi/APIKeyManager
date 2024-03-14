interface AccessToken {
  token: string;
  expiryTime: string; // Should be a valid date string
}

// saveTokenToCookie saves the accessToken and expiryTime to a cookie
export const saveAuthTokenToCookie = ({ token, expiryTime }: AccessToken): void => {
  document.cookie = `accessToken=${token};expires=${new Date(expiryTime).toUTCString()};path=/`;
};

// getCookie retrieves a cookie by name
export function getAuthCookie(name: string = "accessToken"): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}