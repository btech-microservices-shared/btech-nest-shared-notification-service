export abstract class TemplateService<T> {
	abstract renderTemplate(name: string, data: T): Promise<string>
}
