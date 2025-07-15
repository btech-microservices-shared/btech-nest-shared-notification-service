export class Attachment {
	name: string
	url: string
	contentType: string

	constructor(entity: Attachment) {
		Object.assign(this, entity)
	}
}
