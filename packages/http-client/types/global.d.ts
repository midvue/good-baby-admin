export {}

declare global {
  interface IWxRequest {
    url: string
    data: Record<string, any>
    header?: Record<string, string | number | undefined>
    success: (res: Record<string, any>) => void
    fail: (error: any) => void
    complete: () => void
    [key: string]: any
  }
  interface Wx {
    request: (req: IWxRequest) => void
  }
}
