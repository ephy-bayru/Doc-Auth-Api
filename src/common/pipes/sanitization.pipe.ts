import { PipeTransform, Injectable } from '@nestjs/common';
import sanitize, { IOptions } from 'sanitize-html';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SanitizationPipe implements PipeTransform {
  private readonly options: IOptions;

  constructor(private configService: ConfigService) {
    this.options = {
      allowedTags: this.configService
        .get<string>('SANITIZE_ALLOWED_TAGS', 'b,i,em,strong,a')
        .split(','),
      allowedAttributes: this.parseAttributes(
        this.configService.get<string>(
          'SANITIZE_ALLOWED_ATTRIBUTES',
          'a:href,title',
        ),
      ),
      selfClosing: [
        'img',
        'br',
        'hr',
        'area',
        'base',
        'basefont',
        'input',
        'link',
        'meta',
      ],
    };
  }

  transform(value: any) {
    return this.sanitizeValue(value, this.options);
  }

  private sanitizeValue(value: any, options: IOptions): any {
    if (typeof value === 'string') {
      return sanitize(value, options);
    } else if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeValue(item, options));
    } else if (typeof value === 'object' && value !== null) {
      const sanitizedObject = {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          sanitizedObject[key] = this.sanitizeValue(value[key], options);
        }
      }
      return sanitizedObject;
    }
    return value;
  }

  private parseAttributes(attributesString: string): Record<string, string[]> {
    const attributes = {};
    attributesString.split(';').forEach((attr) => {
      const [tag, allowedAttrs] = attr.split(':');
      if (tag && allowedAttrs) {
        attributes[tag] = allowedAttrs.split(',');
      }
    });
    return attributes;
  }
}
