import {ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal} from '@angular/core';
import {HeaderConfig} from "./header.config";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {RouterLink} from "@angular/router";
import {MatDividerModule} from "@angular/material/divider";
import {ConfigService} from "../../config/config.service";

@Component({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    MatDividerModule
  ],
  selector: 'app-common-header',
  styleUrls: ['./header.component.css'],
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  // Signal inputs
  configuration = input<HeaderConfig | undefined>();
  title = input<string>("");
  version = input<string>("");
  subtitle = input<string>("");
  splitSubtitleEvenly = input<boolean>(false);
  showUserManagement = input<boolean>(false);
  backgroundColor = input<string>("#646064");
  enableDashboardApiServices = signal<boolean>(false);
  configService = inject(ConfigService);

  // Computed signal for subtitle - replaces ngOnInit logic
  subtitleInsert = computed(() => {
    if (this.splitSubtitleEvenly()) {
      return this.splitSubtitle(this.subtitle());
    } else {
      return this.subtitle();
    }
  });

  ngOnInit(): void {
    this.enableDashboardApiServices.set(this.configService.config?.enableDashboardApiServices);
  }

  private splitSubtitle(subtitle: string): string {
    const subtitleWordList = subtitle.split(" ");
    const halfLength = Math.floor(subtitleWordList.length / 2);
    let recombinedSubtitle = "";
    subtitleWordList.map((word, i) => {
      recombinedSubtitle += word + " ";
      if (i == halfLength) {
        recombinedSubtitle += "<br>";
      }
    });
    return recombinedSubtitle;
  }

  openLink(link: string | undefined): void {
    if (link) window.open(link, '_blank');
  }
}
