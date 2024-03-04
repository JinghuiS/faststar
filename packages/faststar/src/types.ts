export type PromiseType<P extends Promise<any>> = P extends Promise<infer T> ? T : never

export type FunctionReturningPromise = (...args: any[]) => Promise<any>

interface FaststarRenderResourceFuncProps {
    accessControlList?: string[]
    permissionsRoutes?: string[]
}

export type FaststarChildren =
    | React.ReactNode
    | (({
          accessControlList,
          permissionsRoutes
      }: FaststarRenderResourceFuncProps) => React.ReactNode)
// export type Identifier = string | number
