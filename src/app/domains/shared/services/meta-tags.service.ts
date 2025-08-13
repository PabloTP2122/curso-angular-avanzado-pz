import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

export interface MetaTags {
  title: string;
  description: string;
  image: string;
  url: string;
}

const defaultMetaData: MetaTags = {
  title: 'Store',
  description: 'Simple store example',
  image: '',
  url: environment.domain,
};

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  //Meta tags dinámicas
  titleService = inject(Title);
  metaService = inject(Meta);

  updateMetaTags(metaTags: Partial<MetaTags>) {
    const metaData = { ...defaultMetaData, ...metaTags };
    const tags = this.generateMetaDefinitions(metaData);
    tags.forEach(tag => this.metaService.updateTag(tag));

    this.titleService.setTitle(metaData.title);
  }

  private generateMetaDefinitions(metaTags: MetaTags): MetaDefinition[] {
    return [
      {
        name: 'title',
        content: metaTags.title,
      },
      {
        name: 'description',
        content: metaTags.description,
      },
      {
        name: 'og:description',
        content: metaTags.description,
      },
      {
        name: 'og:title',
        content: metaTags.title,
      },
      {
        name: 'og:image',
        content: metaTags.image,
      },
      {
        name: 'og:url',
        content: metaTags.url,
      },
    ];
  }
}
