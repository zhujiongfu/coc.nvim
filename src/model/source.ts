import { Neovim } from 'neovim'
import {getConfig} from '../config'
import {SourceOption,
  CompleteOption,
  CompleteResult} from '../types'

export default abstract class Source {
  public readonly name: string
  public readonly shortcut?: string
  public readonly priority: number
  public readonly filetypes: string[] | null | undefined
  public readonly engross: boolean
  public readonly nvim: Neovim
  constructor(nvim: Neovim, option: SourceOption) {
    let {shortcut, filetypes, name}  = option
    this.nvim = nvim
    this.name = name
    this.filetypes = Array.isArray(filetypes) ? filetypes : null
    this.engross = !!option.engross
    if (!shortcut) {
      this.shortcut = name.slice(0, 3).toUpperCase()
    } else {
      this.shortcut = shortcut.slice(0, 3).toUpperCase()
    }
  }

  public get menu():string {
    return `[${this.shortcut}]`
  }

  public checkFileType(filetype: string):boolean {
    if (this.filetypes == null) return true
    return this.filetypes.indexOf(filetype) !== -1
  }

  // some source could overwrite it
  public async refresh():Promise<void> {
    // do nothing
  }

  public abstract shouldComplete(opt: CompleteOption): Promise<boolean>

  public abstract doComplete(opt: CompleteOption): Promise<CompleteResult>
}
